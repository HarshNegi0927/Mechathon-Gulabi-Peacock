import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail } from 'lucide-react';
import { useTheme } from '../pages/LandingPage';

const Team = () => {
  const { isDarkMode } = useTheme();

  const teamMembers = [
    {
      name: 'Harsh Negi',
      role: 'Backend Developer',
      image: '/harshnegi.enc',
      bio: 'Harsh is an experienced backend developer with a passion for creating robust and scalable server-side solutions.',
      linkedin: '#',
      twitter: '#',
      email: 'harsh@ticktracker.com',
    },
    {
      name: 'Abhay Goyal',
      role: 'Frontend Developer',
      image: '/abhay.jpeg',
      bio: 'Abhay is a creative frontend developer who loves crafting beautiful and intuitive user interfaces.',
      linkedin: '#',
      twitter: '#',
      email: 'abhay@ticktracker.com',
    },
    {
      name: 'Krishna Raj Aggrawal',
      role: 'Frontend Developer',
      image: '/krishna.jpeg',
      bio: 'Krishna is a frontend developer with a keen eye for design and a focus on creating seamless user experiences.',
      linkedin: '#',
      twitter: '#',
      email: 'krishna@ticktracker.com',
    },
  ];

  return (
    <section id="team" className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className={`text-3xl font-extrabold sm:text-4xl mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Meet Our <span className="text-blue-600">Team</span>
          </h2>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
            The talented individuals behind TickTracker, dedicated to revolutionizing personal finance management.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg overflow-hidden shadow-lg`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full object-cover object-center"
              />
              <div className="p-6">
                <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{member.name}</h3>
                <p className="text-blue-600 mb-4">{member.role}</p>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{member.bio}</p>
                <div className="flex space-x-4">
                  <a href={member.linkedin} className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-300`}>
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a href={member.twitter} className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-300`}>
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href={`mailto:${member.email}`} className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-300`}>
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Join Our Team</h3>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
            We're always looking for talented individuals to join our mission. If you're passionate about
            finance and technology, we'd love to hear from you!
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
          >
            View Open Positions
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;

