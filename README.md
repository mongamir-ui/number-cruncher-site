# Number Cruncher Tax Specialist

Professional accounting, taxation, and compliance solutions website for South Africa.

## Overview

A modern, responsive static website for Number Cruncher Tax Specialist featuring:
- Dark theme with gold accents
- Animated scroll effects
- Operational contact form
- Google Maps integration
- Mobile-responsive design

## Deployment Options

### Option 1: AWS S3 Static Website Hosting

1. **Create an S3 Bucket**
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

2. **Enable Static Website Hosting**
   - Go to S3 Console > Your Bucket > Properties
   - Click "Static website hosting"
   - Select "Use this bucket to host a website"
   - Enter `index.html` as Index document
   - Enter `404.html` as Error document (optional)

3. **Upload Files**
   ```bash
   aws s3 sync . s3://your-bucket-name --exclude "*.md"
   ```

4. **Set Bucket Policy** (Required for public access)
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Sid": "PublicReadGetObject",
               "Effect": "Allow",
               "Principal": "*",
               "Action": "s3:GetObject",
               "Resource": "arn:aws:s3:::your-bucket-name/*"
           }
       ]
   }
   ```

5. **Apply Policy**
   ```bash
   aws s3api put-bucket-policy --bucket your-bucket-name --policy file://bucket-policy.json
   ```

### Option 2: GitHub Pages

1. Create a new GitHub repository
2. Upload all files to the repository
3. Go to Settings > Pages
4. Select "Deploy from a branch"
5. Choose `main` branch and `/ (root)` folder
6. Save and wait for deployment

### Option 3: Traditional Web Hosting

Upload all files to your web root directory via FTP/SFTP:
- `index.html`
- `styles.css`
- `main.js`
- `assets/` folder (if you have custom assets)

## File Structure

```
number-cruncher-site/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── main.js             # JavaScript functionality
├── README.md           # This file
└── assets/            # Images and other assets
    └── images/
```

## Contact Form Setup

The contact form currently simulates submissions. To make it functional:

### Using Formspree (Recommended)

1. Go to [Formspree.io](https://formspree.io)
2. Create a free account
3. Create a new form
4. Replace the form action in `index.html`:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Using EmailJS

1. Go to [EmailJS.com](https://www.emailjs.com)
2. Create an account and set up email service
3. Update the form submission in `main.js` with your EmailJS credentials

## Customizing the Site

### Update Contact Information

Edit `index.html` and replace placeholder information:
- Phone: Line ~270
- Email: Line ~271
- Address: Line ~275

### Update Google Maps

Edit the iframe `src` attribute in `index.html`:
```html
<iframe src="https://www.google.com/maps/embed?pb=!1m18!...">
```

Generate your own embed code from [Google Maps](https://www.google.com/maps)

### Change Director Image

Replace the image URL in `index.html` line ~84:
```html
<img src="YOUR_IMAGE_URL" alt="Director">
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized for fast loading
- AOS (Animate On Scroll) library for smooth animations
- CSS-based animations for better performance
- Responsive images (if configured)

## License

Copyright © 2025 Number Cruncher Tax Specialist. All Rights Reserved.
