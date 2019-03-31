library(osmdata)
library(tidyverse)
library(dplyr)
library(ggplot2)
library(ggmap)
library(rworldmap)
library(readr)
library(stringr)
library(rjson)
library(jsonlite)
library(XML)
library(xml2)
library(dplyr)
library(purrr)
library(httr)
library(rvest)
library(lubridate)
library(viridis)
library(leaflet)
library(leaflet.extras)
library(htmltools)
library(rgeos)
library(sp)
library(rgdal)

# Import Islington council json
gov_raw <-
  jsonlite::fromJSON("data/islington-cctv.json", flatten = TRUE)
gov <- gov_raw$d[[2]]

# Clean Islington council data
gov_split <-
  setNames(data.frame(do.call("rbind", strsplit(
    gsub("\\(|\\)|,", "", gov$GeometryLL), split = " "
  ))), c("Long", "Lat"))

gov <- data.frame(cbind(gov[, 1:(length(gov) - 1)], gov_split))

gov$Long = as.numeric(as.character(gov$Long))
gov$Lat = as.numeric(as.character(gov$Lat))

# Import Camden postcode data and select every 10th

camden_ps <-
  read_csv("data/National_Statistics_Postcode_Lookup_Camden_Map.csv")

camden_ps$url <-
  paste(
    "http://find.camden.gov.uk/nearestrest.aspx?find=CCTV+camera&area=",
    camden_ps$`Postcode 1`,
    sep = ""
  )

camden_ps <- camden_ps[, c(1, 37)]

# camden_ps <- camden_ps[seq(1, nrow(camden_ps), 10),]

# (ALREADY DOWNLOADED) Download cameras nearest to Camden postcodes

# numb = 1
#
# for (file in camden_ps$url) {
#   download.file(file,
#                 destfile = paste("camden-cctv/", camden_ps$`Postcode 1`[numb], ".xml", sep = ""))
#   numb = numb + 1
#   Sys.sleep(sample(1:5, 1))
# }

# Import Camden Council CCTV locations and remove duplicates

camden_files <-
  dir(
    recursive = T,
    pattern = "*.xml",
    path = "data/camden-cctv",
    full.names = TRUE
  )

read_dist <- . %>%
  read_xml() %>%
  xml_find_all(., "//Property") %>%
  map_dfr(~ {
    camden_longs <- as.numeric(trimws(xml_attr(.x, "Longitude")))
    
    camden_lats <- as.numeric(trimws(xml_attr(.x, "Latitude")))
    
    camden_ll <- as.data.frame(cbind(camden_longs, camden_lats))
  })

camden_ll <- map_df(camden_files, read_dist)

camden_ll <- distinct(camden_ll)

# # TfL
# Import and prepare TfL data

jam <- read_csv("data/jamcam.csv")

london_b <-
  readOGR(
    "data/statistical-gis-boundaries-london/ESRI/London_Borough_Excluding_MHW.shp",
    layer = "London_Borough_Excluding_MHW"
  )

isl <- london_b[london_b$NAME == "Islington",]
cmd <- london_b[london_b$NAME == "Camden",]

coordinates(jam) <- ~ Longitude + Latitude

proj4string(jam) <- proj4string(isl)
proj4string(jam) <- proj4string(cmd)

islLL = spTransform(isl, "+init=epsg:4326")
cmdLL = spTransform(cmd, "+init=epsg:4326")

jam_isl <- raster::intersect(jam, islLL)
jam_cmd <- raster::intersect(jam, cmdLL)

# Import and filter crime data

london_files <-
  dir(
    recursive = T,
    pattern = "*metropolitan-street.csv",
    path = "data/crime",
    full.names = TRUE
  )

london_police_data <- do.call(rbind, lapply(london_files, read.csv))

islington_crime <-
  filter(london_police_data, grepl("Islington", LSOA.name, fixed = TRUE))

camden_crime <-
  filter(london_police_data, grepl("Camden", LSOA.name, fixed = TRUE))

# Map CCTV cameras
tflIcons <- icons(iconUrl = "img/tfl.png",
                  iconWidth = 15,
                  iconHeight = 15)

govIcons <- icons(iconUrl = "img/gov.png",
                  iconWidth = 15,
                  iconHeight = 15)

islington_crime %>%
  leaflet() %>%
  addMarkers(
    lng = ~ as.numeric(camden_ll$camden_longs),
    lat = ~ as.numeric(camden_ll$camden_lats),
    icon = govIcons
  ) %>%
  addMarkers(
    lng = ~ as.numeric(gov$Long),
    lat = ~ as.numeric(gov$Lat),
    icon = govIcons
  ) %>%
  addProviderTiles(providers$CartoDB.Positron) %>%
  addMarkers(
    lng = ~ as.numeric(jam_isl$Longitude),
    lat = ~ as.numeric(jam_isl$Latitude),
    icon = tflIcons
  ) %>%
  addProviderTiles(providers$CartoDB.Positron) %>%
  addMarkers(
    lng = ~ as.numeric(jam_cmd$Longitude),
    lat = ~ as.numeric(jam_cmd$Latitude),
    icon = tflIcons
  ) %>%
  addHeatmap(
    lng =  ~ as.numeric(Longitude),
    lat =  ~ as.numeric(Latitude),
    radius = 8
  ) %>%
  addHeatmap(
    lng =  ~ as.numeric(camden_crime$Longitude),
    lat =  ~ as.numeric(camden_crime$Latitude),
    radius = 8
  )

# # Generate static maps for Islington
lnd_map <-
  get_map(getbb("Islington Borough Greater London UK"),
          source = "google",
          maptype = "terrain")

# Download Open Street Map data
osm <- opq(bbox = "Islington Greater London UK") %>%
  add_osm_feature(
    key = "man_made",
    value = "surveillance",
    value_exact = FALSE,
    match_case = FALSE
  ) %>%
  osmdata_sf()

# Map gov data
ggmap(lnd_map) +
  geom_point(
    data = gov,
    aes(x = Long, y = Lat),
    colour = "#238443",
    fill = "#004529",
    alpha = .5,
    size = 4,
    shape = 21
  ) +
  theme(
    axis.title.x = element_blank(),
    axis.text.x = element_blank(),
    axis.ticks.x = element_blank(),
    axis.title.y = element_blank(),
    axis.text.y = element_blank(),
    axis.ticks.y = element_blank()
  )

# Map TfL data
ggmap(lnd_map) +
  geom_point(
    data = jam,
    aes(x = Longitude, y = Latitude),
    colour = "#238443",
    fill = "#F4692F",
    alpha = .5,
    size = 4,
    shape = 21
  ) +
  theme(
    axis.title.x = element_blank(),
    axis.text.x = element_blank(),
    axis.ticks.x = element_blank(),
    axis.title.y = element_blank(),
    axis.text.y = element_blank(),
    axis.ticks.y = element_blank()
  )

# Map OSM data
ggmap(lnd_map) +
  geom_sf(
    data = osm$osm_points,
    inherit.aes = FALSE,
    colour = "#238443",
    fill = "#D53635",
    alpha = .5,
    size = 4,
    shape = 21
  ) +
  theme(
    axis.title.x = element_blank(),
    axis.text.x = element_blank(),
    axis.ticks.x = element_blank(),
    axis.title.y = element_blank(),
    axis.text.y = element_blank(),
    axis.ticks.y = element_blank()
  )