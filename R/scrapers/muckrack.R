library(tidyverse)

muckrack <- read_csv("R/data/muckrack.csv") |>
    mutate(
        # Extract text content after the HTML div by finding the last </div> and taking everything after it
        summary = map_chr(
            summary,
            ~ {
                # Find the last occurrence of </div> and extract everything after it
                last_div_pos <- str_locate_all(.x, "</div>")[[1]]

                if (nrow(last_div_pos) > 0) {
                    # Get the position after the last </div>
                    start_pos <- last_div_pos[nrow(last_div_pos), "end"] + 1
                    # Extract the text after the last </div>
                    text_content <- str_sub(.x, start_pos)
                } else {
                    # If no </div> found, return the original text
                    text_content <- .x
                }

                # Clean up whitespace
                text_content <- str_trim(text_content)

                return(text_content)
            }
        ),
        releaseDate = map_chr(
            releaseDate,
            ~ {
                if (is.na(.x)) {
                    return(.x) # Return as is if NA
                }
                # Keep only the first 10 characters
                return(str_sub(.x, 1, 10))
            }
        ),
    ) |>
    arrange(desc(releaseDate)) |>
    group_by(name) |>
    mutate(count = n()) |>
    ungroup() |>
    select(-count)


jsonlite::write_json(
    muckrack,
    "R/data/muckrack-articles.json",
    auto_unbox = TRUE,
    pretty = TRUE
)
