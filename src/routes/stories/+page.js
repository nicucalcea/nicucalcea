import cvData from '../../data/cv.json';

export function load() {
  // Return all publications sorted chronologically (latest first)
  const sortedPublications = cvData.publications
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    
  return {
    cv: {
      ...cvData,
      publications: sortedPublications
    }
  };
}
