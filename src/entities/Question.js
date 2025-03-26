import Papa from 'papaparse';

/**
 * Question entity class for managing question data
 */
class Question {
  /**
   * Get mock data for fallback
   * @returns {Array} - Array of question objects
   */
  static getMockData() {
    return [
      {
        "id": "ch1_q1",
        "figure_number": "1.1",
        "question_text": "The image shows a choristoma. What is the defining feature of a choristoma?",
        "image_url": "/api/placeholder/400/300",
        "option_a": "Abnormal growth of normal tissue",
        "option_b": "Normal tissue in an abnormal location",
        "option_c": "Malignant cellular transformation",
        "option_d": "Inflammation of normal tissue",
        "correct_answer": "B",
        "explanation": "A choristoma is defined as normal tissue found in an abnormal location. It is a congenital anomaly, not a neoplastic process. In the eye, choristomas commonly consist of dermoid tissue and can be found on the conjunctiva, cornea, or eyelid.",
        "chapter": "1",
        "category": "developmental_anomaly",
        "difficulty": "medium"
      },
      {
        "id": "ch1_q2",
        "figure_number": "1.2",
        "question_text": "This image demonstrates a process of corneal opacity. What is the most likely diagnosis?",
        "image_url": "/api/placeholder/400/300",
        "option_a": "Corneal dystrophy",
        "option_b": "Keratoconus",
        "option_c": "Band keratopathy",
        "option_d": "Arcus senilis",
        "correct_answer": "C",
        "explanation": "The image shows band keratopathy, which is characterized by calcium deposition in the Bowman layer of the cornea, typically in a horizontal band pattern. It is commonly associated with chronic uveitis, hypercalcemia, and chronic ocular inflammation.",
        "chapter": "1",
        "category": "dystrophy_and_degeneration",
        "difficulty": "medium"
      },
      {
        "id": "ch1_q3",
        "figure_number": "1.3",
        "question_text": "The image shows granulomatous inflammation. Which of the following cells is most characteristic of granulomatous inflammation?",
        "image_url": "/api/placeholder/400/300",
        "option_a": "Neutrophils",
        "option_b": "Eosinophils",
        "option_c": "Epithelioid macrophages",
        "option_d": "Plasma cells",
        "correct_answer": "C",
        "explanation": "Granulomatous inflammation is characterized by the presence of epithelioid macrophages, which may fuse to form multinucleated giant cells. These are the hallmark cells of granulomatous inflammation, which is a distinctive pattern of chronic inflammation seen in conditions such as tuberculosis, sarcoidosis, and some foreign body reactions.",
        "chapter": "1",
        "category": "inflammation",
        "difficulty": "hard"
      },
      {
        "id": "ch1_q4",
        "figure_number": "1.4",
        "question_text": "The image demonstrates a neoplastic process. Which of the following describes a feature of benign neoplasms?",
        "image_url": "/api/placeholder/400/300",
        "option_a": "Rapid growth",
        "option_b": "Cellular pleomorphism",
        "option_c": "Well-defined borders",
        "option_d": "Vascular invasion",
        "correct_answer": "C",
        "explanation": "Benign neoplasms typically have well-defined borders and are often encapsulated. They also tend to have slower growth rates, less cellular pleomorphism, minimal to no mitotic activity, and lack features such as invasiveness or metastasis that are characteristic of malignant tumors.",
        "chapter": "1",
        "category": "neoplasia",
        "difficulty": "easy"
      },
      {
        "id": "ch1_q5",
        "figure_number": "1.5",
        "question_text": "The image shows an inflammatory process in the conjunctiva. Which cell type predominates in acute inflammatory responses?",
        "image_url": "/api/placeholder/400/300",
        "option_a": "Neutrophils",
        "option_b": "Lymphocytes",
        "option_c": "Macrophages",
        "option_d": "Fibroblasts",
        "correct_answer": "A",
        "explanation": "Neutrophils are the predominant cell type in acute inflammatory responses. They are the first leukocytes to migrate to the site of inflammation and play a key role in the early defense against infection, particularly bacterial infections. Neutrophils have multi-lobed nuclei and contain granules with antimicrobial proteins and enzymes.",
        "chapter": "1",
        "category": "inflammation",
        "difficulty": "easy"
      },
      {
        "id": "ch1_q6",
        "figure_number": "1.6",
        "question_text": "The image shows phthisis bulbi. Which of the following is the best description of phthisis bulbi?",
        "image_url": "/api/placeholder/400/300",
        "option_a": "Acute bacterial infection of the eye",
        "option_b": "Ischemic necrosis of the retina",
        "option_c": "End-stage ocular degeneration with atrophy and shrinkage",
        "option_d": "Traumatic rupture of the globe",
        "correct_answer": "C",
        "explanation": "Phthisis bulbi represents end-stage ocular degeneration characterized by atrophy, disorganization, and shrinkage of the globe. It is often the result of severe ocular trauma, inflammation, or disease that leads to loss of intraocular pressure and subsequent collapse of the eye.",
        "chapter": "1",
        "category": "dystrophy_and_degeneration",
        "difficulty": "medium"
      }
    ];
  }

  /**
   * Fetch all questions
   * @param {string} chapter - Optional chapter to filter questions
   * @returns {Promise<Array>} - Array of question objects
   */
  static async list(chapter = null) {
    try {
      console.log("Attempting to fetch questions from CSV");
      // In a real application, this would be an API call
      // For now, we'll read from the CSV file
      const response = await fetch('/data/questions.csv');
      
      if (!response.ok) {
        console.log("CSV fetch failed, using mock data");
        throw new Error('Failed to fetch questions CSV');
      }
      
      const csvData = await response.text();
      
      if (!csvData || csvData.trim() === '') {
        console.log("Empty CSV data, using mock data");
        throw new Error('Empty CSV data');
      }
      
      const result = Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      });
      
      if (result.errors && result.errors.length > 0) {
        console.error('CSV parsing errors:', result.errors);
      }
      
      // Filter by chapter if specified
      let questions = result.data;
      if (chapter) {
        questions = questions.filter(q => q.chapter === chapter);
      }
      
      // Fix boolean values (is_sample)
      questions = questions.map(q => ({
        ...q,
        is_sample: q.is_sample === 'true' || q.is_sample === true
      }));
      
      return questions;
    } catch (error) {
      console.error('Error loading questions:', error);
      console.log('Falling back to mock data');
      
      // Fall back to mock data
      let mockData = this.getMockData();
      
      // Filter by chapter if specified
      if (chapter) {
        mockData = mockData.filter(q => q.chapter === chapter);
      }
      
      return mockData;
    }
  }
  
  /**
   * Fetch questions by chapter from JSON file
   * @param {string} chapterNumber - The chapter number
   * @returns {Promise<Array>} - Array of question objects
   */
  static async getByChapter(chapterNumber) {
    try {
      console.log(`Attempting to fetch questions for chapter ${chapterNumber}`);
      const response = await fetch(`/data/chapters/chapter${chapterNumber}/questions.json`);
      
      if (!response.ok) {
        console.log(`Failed to fetch chapter ${chapterNumber}, using mock data`);
        throw new Error(`Failed to fetch questions for chapter ${chapterNumber}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error loading questions for chapter ${chapterNumber}:`, error);
      console.log('Falling back to mock data filtered by chapter');
      
      // Filter mock data by chapter number
      return this.getMockData().filter(q => q.chapter === chapterNumber);
    }
  }

  /**
   * Get a question by ID
   * @param {string} id - Question ID
   * @returns {Promise<Object|null>} - Question object or null if not found
   */
  static async getById(id) {
    try {
      const questions = await this.list();
      return questions.find(q => q.id === id) || null;
    } catch (error) {
      console.error('Error finding question:', error);
      
      // Try to find in mock data
      const mockData = this.getMockData();
      return mockData.find(q => q.id === id) || null;
    }
  }
  
  /**
   * Get image URL for a question based on chapter and figure number
   * @param {Object} question - Question object
   * @returns {string} - URL to the image
   */
  static getImageUrl(question) {
    if (!question) return '/api/placeholder/400/300';
    
    // If question has a complete image URL that starts with http, use that
    if (question.image_url && question.image_url.startsWith('http')) {
      return question.image_url;
    }
    
    // If question has an image_url that's not http but not empty, use that
    if (question.image_url && question.image_url.trim() !== '') {
      // Check if it's a relative URL
      if (question.image_url.startsWith('/')) {
        return question.image_url;
      }
      return `/${question.image_url}`;
    }
    
    // Otherwise construct URL from figure number
    if (question.figure_number) {
      const chapterNum = question.chapter || '1';
      const figureNum = question.figure_number.replace(/\s+/g, '_').toLowerCase();
      
      return `/data/chapters/chapter${chapterNum}/images/${figureNum}.jpg`;
    }
    
    // Fallback to placeholder
    return '/api/placeholder/400/300';
  }
  
  /**
   * Format figures by difficulty
   * @param {Array} questions - Array of question objects
   * @returns {Object} - Object with questions grouped by difficulty
   */
  static groupByDifficulty(questions) {
    const result = {
      easy: [],
      medium: [],
      hard: []
    };
    
    questions.forEach(q => {
      const difficulty = q.difficulty || 'medium';
      if (result[difficulty]) {
        result[difficulty].push(q);
      } else {
        result.medium.push(q);
      }
    });
    
    return result;
  }
  
  /**
   * Group questions by category
   * @param {Array} questions - Array of question objects
   * @returns {Object} - Object with questions grouped by category
   */
  static groupByCategory(questions) {
    return questions.reduce((acc, question) => {
      const category = question.category || 'uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(question);
      return acc;
    }, {});
  }
}

export { Question };
