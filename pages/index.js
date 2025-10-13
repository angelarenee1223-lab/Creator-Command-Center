import React, { useState } from 'react';
import { Lightbulb, FileText, Repeat, Archive, TrendingUp, Sparkles, Clock, Target, Zap, Video } from 'lucide-react';

export default function CreatorCommandCenter() {
  const [activeTab, setActiveTab] = useState('ideas');
  const [niche, setNiche] = useState('');
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [script, setScript] = useState('');
  const [scriptTone, setScriptTone] = useState('casual');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [clips, setClips] = useState([]);
  const [vault, setVault] = useState([]);

  const generateIdeas = async () => {
    if (!niche.trim()) {
      alert('Please enter a niche or topic!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: `You are a viral content strategist. Generate 10 engaging video ideas for content creators in the "${niche}" niche.

For each idea, provide:
1. A catchy title
2. A hook (first 5 seconds)
3. Why it will perform well
4. Estimated engagement potential (High/Medium)

Format as JSON:
[
  {
    "title": "string",
    "hook": "string",
    "why": "string",
    "engagement": "High/Medium"
  }
]

CRITICAL: Your response must ONLY be valid JSON. DO NOT include any text before or after the JSON. DO NOT wrap it in markdown code blocks.`
            }
          ]
        })
      });

      const data = await response.json();
      let responseText = data.content[0].text;
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const generatedIdeas = JSON.parse(responseText);
      setIdeas(generatedIdeas);
    } catch (error) {
      console.error('Error generating ideas:', error);
      alert('Error generating ideas. Please try again!');
    }
    setLoading(false);
  };

  const generateScript = async (idea) => {
    setSelectedIdea(idea);
    setLoading(true);
    setActiveTab('script');
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          messages: [
            {
              role: "user",
              content: `Write a complete video script for this idea:

Title: ${idea.title}
Hook: ${idea.hook}
Tone: ${scriptTone}

Create a 5-7 minute video script with:
- Opening hook (first 10 seconds)
- Introduction
- 3-4 main points with examples
- Call to action
- Outro

Make it ${scriptTone} and engaging. Format it clearly with sections.`
            }
          ]
        })
      });

      const data = await response.json();
      setScript(data.content[0].text);
      
      setVault(prev => [...prev, {
        type: 'script',
        title: idea.title,
        content: data.content[0].text,
        date: new Date().toLocaleDateString()
      }]);
    } catch (error) {
      console.error('Error generating script:', error);
      alert('Error generating script. Please try again!');
    }
    setLoading(false);
  };

  const repurposeVideo = async () => {
    if (!youtubeUrl.trim()) {
      alert('Please enter a YouTube URL!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          messages: [
            {
              role: "user",
              content: `Analyze this YouTube video and create a repurposing strategy: ${youtubeUrl}

Generate 8 short-form content pieces with:
1. Clip title
2. Timestamp (e.g., "2:34-2:58")
3. TikTok caption (engaging, with hook)
4. Instagram caption (slightly different angle)
5. Hashtags (5 relevant ones)
6. Why this clip will perform well

Format as JSON array:
[
  {
    "title": "string",
    "timestamp": "string",
    "tiktokCaption": "string",
    "instagramCaption": "string",
    "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
    "performance": "string"
  }
]

CRITICAL: Your response must ONLY be valid JSON. DO NOT include any text before or after the JSON. DO NOT wrap it in markdown code blocks.`
            }
          ]
        })
      });

      const data = await response.json();
      let responseText = data.content[0].text;
      responseText = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const generatedClips = JSON.parse(responseText);
      setClips(generatedClips);
      
      setVault(prev => [...prev, {
        type: 'repurpose',
        title: `Repurposed: ${youtubeUrl.substring(0, 50)}...`,
        content: generatedClips,
        date: new Date().toLocaleDateString()
      }]);
    } catch (error) {
      console.error('Error repurposing video:', error);
      alert('Error analyzing video. Please try again!');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
