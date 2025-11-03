import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../utils/api'; // Your axios instance

const Search = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // Gets the query from the URL

  useEffect(() => {
    // Only run the search if a query is present
    if (query) {
      setLoading(true);
      api
        .get(`/search?q=${query}`)
        .then((res) => {
          setResults(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [query]); // Re-run the search whenever the 'q' parameter changes

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {/* This h2 matches your E2E test assertion */}
      <h2 className="text-3xl font-bold mb-4">Search Results for "{query}"</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {results.length > 0 ? (
            results.map((post) => (
              <div key={post._id} className="p-4 bg-white rounded-lg shadow">
                {/* This h3 matches your E2E test assertion */}
                <h3 className="text-xl font-bold">{post.title}</h3>
                <p className="text-gray-700">
                  {post.text.substring(0, 100)}...
                </p>
              </div>
            ))
          ) : (
            <p>No results found for "{query}".</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
