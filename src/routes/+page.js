import cvData from '../data/cv.json';

export function load() {
  // Filter publications to only include featured ones and sort chronologically (latest first)
  const featuredPublications = cvData.publications
    .filter(publication => publication.featured === true)
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
  
  return {
    cv: {
      ...cvData,
      publications: featuredPublications
    }
  };
}
