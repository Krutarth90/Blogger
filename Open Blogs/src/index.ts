import axios from 'axios';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 5173;

app.get('/get-tech-news', async (req, res) => {
  try {
    // Fetch tech news from NewsAPI
    const newsApiResponse = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'technology',  // Search term (you can modify it)
        sortBy: 'publishedAt',  // Sort by publication date
        language: 'en',  // Language of the articles
        apiKey: `${process.env.NEWS_API}`,  // API key from NewsAPI
      },
    });

    const articles = newsApiResponse.data.articles;

    // Transform the fetched news to match your desired format
    const techNews = articles.map((article: any) => ({
      title: article.title,
      content: article.description || article.content, // Use description or content
      tags : []  
    }));


  for (const blog of techNews) {
    try {
      await axios.post(process.env.TARGET_API!, blog, {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`,
          "Content-Type": "application/json"
        }
      });
    } catch (err : any) {
      console.error("Error posting blog:", blog.title, err.response?.data || err.message);
    }
  }
    // Send success response to client
    res.json({ message: 'Tech news successfully posted to your API.' });

  } catch (error) {
    console.error('Error fetching or posting tech news:', error);
    res.status(500).send('Error fetching or posting tech news.');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
