const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

// Create DOMPurify
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// XSS Middleware
const xssMiddleware = (req, res, next) => {
  // Iterate over req.body
  Object.keys(req.body).forEach((key) => {
    if (typeof req.body[key] === 'string') {
      // Sanitize the string using DOMPurify
      req.body[key] = DOMPurify.sanitize(req.body[key]);
    }
  });

  // Iterate over req.query
  Object.keys(req.query).forEach((key) => {
    if (typeof req.query[key] === 'string') {
      // Sanitize the string using DOMPurify
      req.query[key] = DOMPurify.sanitize(req.query[key]);
    }
  });

  // Iterate over req.params
  Object.keys(req.params).forEach((key) => {
    if (typeof req.params[key] === 'string') {
      // Sanitize the string using DOMPurify
      req.params[key] = DOMPurify.sanitize(req.params[key]);
    }
  });

  next();
};

module.exports = xssMiddleware;
