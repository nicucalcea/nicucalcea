# library(tidyverse)
# library(rvest)

# read_moldova <- function(page = 1) {
#     Sys.sleep(1)
#     url <- paste0("https://www.moldova.org/en/author/nicu/page/", page, "/")

#     moldova_raw <- read_html(url) |>
#         html_elements("#posts article")

#     moldova_data <- moldova_raw |>
#         map_dfr(
#             ~ {
#                 name <- .x |>
#                     html_element("h2") |>
#                     html_text(trim = TRUE)

#                 releaseDate <- .x |>
#                     html_element("time") |>
#                     html_attr("datetime") |>
#                     str_sub(1, 10)

#                 url <- .x |>
#                     html_element(".entry-permalink") |>
#                     html_attr("href")

#                 summary <- .x |>
#                     html_element(".entry-permalink") |>
#                     html_element("p") |>
#                     html_text(trim = TRUE)

#                 tibble(
#                     name = name,
#                     publisher = "Moldova.org",
#                     releaseDate = releaseDate,
#                     url = url,
#                     summary = summary
#                 )
#             }
#         )

#     return(moldova_data)
# }

# # read_moldova(1)

# scrape_all_moldova <- function() {
#     all_articles <- tibble()
#     page <- 1
#     has_articles <- TRUE

#     while (has_articles) {
#         message(paste("Scraping page", page))

#         articles <- try(read_moldova(page), silent = TRUE)

#         if (inherits(articles, "try-error") || nrow(articles) == 0) {
#             message("No more articles found.")
#             has_articles <- FALSE
#         } else {
#             all_articles <- bind_rows(all_articles, articles)
#             page <- page + 1
#             Sys.sleep(1) # Add a delay to be respectful to the server
#         }
#     }

#     return(all_articles)
# }

# moldova_articles <- scrape_all_moldova()

# write_csv(
#     moldova_articles,
#     "R/data/moldovaorg.csv"
# )
