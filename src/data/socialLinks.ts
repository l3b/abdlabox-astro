// src/data/socialLinks.ts

// Define a type for the link object for type safety
export interface SocialLink {
    name: string;
    url: string;
    icon?: string; // Icon name (e.g., 'simple-icons:github'), optional
    category: string;
  }
  
  // Define the array of links with the SocialLink type
  const socialLinks: SocialLink[] = [
    // Professional Links
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/abdullahalthani",
      icon: "simple-icons:linkedin",
      category: "Professional"
    },
    {
      name: "GitHub",
      url: "https://github.com/l3b",
      icon: "simple-icons:github",
      category: "Professional"
    },
    // Writing
    {
      name: "Medium",
      url: "https://medium.com/@AbdullahALThani",
      icon: "simple-icons:medium",
      category: "Writing"
    },
    // Reading
    {
      name: "Goodreads",
      url: "https://www.goodreads.com/althani",
      icon: "simple-icons:goodreads",
      category: "Reading"
    },
    // Activity
    {
      name: "Strava",
      url: "https://www.strava.com/athletes/abdullahalthani",
      icon: "simple-icons:strava",
      category: "Activity"
    },
    // Learning
    {
      name: "Coursera",
      url: "https://www.coursera.org/learner/abdullahalthani",
      // icon was missing, let's add it (or remove the icon property if none exists)
      icon: "simple-icons:coursera",
      category: "Learning"
    },
    {
      name: "Duolingo",
      url: "https://www.duolingo.com/profile/AbdullahAlthani",
      icon: "simple-icons:duolingo",
      category: "Learning"
    },
    // Media
    {
      name: "Trakt.tv",
      url: "https://trakt.tv/users/althani",
      icon: "simple-icons:trakt",
      category: "Media"
    },
    {
      name: "IMDb",
      url: "https://www.imdb.com/user/ur54816740", // NOTE: Replace placeholder ID
      icon: "simple-icons:imdb",
      category: "Media"
    }
    // Add Farcaster, Lens etc. here when ready
  ];
  
  export default socialLinks; // Export the array