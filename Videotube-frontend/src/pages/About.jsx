
import React from 'react';
import Container from '../components/shared/Container/Container';

function About() {
  return (
    <Container className="py-10">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About VideoTube</h1>
        
        <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p className="text-lg">
            VideoTube is a video-sharing platform inspired by YouTube.
            Users can explore videos, search content, and watch videos
            without logging in.
          </p>
          
          <p className="text-lg">
            To interact with videos — like, subscribe, comment, or save —
            users must sign in.
          </p>
          
          <div className="bg-indigo-50 dark:bg-slate-800 p-6 rounded-xl border-l-4 border-indigo-500">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Technical Showcase</h3>
            <p>
              This project is built using modern full-stack technologies
              and created as a learning and portfolio application.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default About;
