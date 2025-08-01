library(tidyverse)

ns <- read_csv("R/data/new-statesman.csv") |>
    mutate(
        publisher = "New Statesman",
        releaseDate = lubridate::dmy(releaseDate),
        summary = ifelse(is.na(summary), `first-par`, summary)
    ) |>
    select(name, publisher, releaseDate, url = `articles-href`, summary)

jsonlite::write_json(
    ns,
    "R/data/ns.json",
    auto_unbox = TRUE,
    pretty = TRUE
)
