library(tidyverse)

samizdata <- read_csv("R/data/samizdata.csv") |>
    mutate(
        publisher = "SAMIZDATA",
        releaseDate = as.Date(releaseDate)
    ) |>
    select(name = title, publisher, releaseDate, url = `url-href`, summary)

jsonlite::write_json(
    samizdata,
    "R/data/samizdata.json",
    auto_unbox = TRUE,
    pretty = TRUE
)
