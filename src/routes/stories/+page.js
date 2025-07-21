import cvData from '../../data/cv.json';

export const prerender = true;
export const ssr = true;
export const csr = false;

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
