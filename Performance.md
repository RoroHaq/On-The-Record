# Performance Report

## Initial Report

The following was our first lighthouse run during Milestone 2, netting a score of 60. There are some things to note here, such as the fact that the website was in develop mode when this was ran. Thus, many of these issues were actually solved by vite and rollup when the project is in production mode.

![Initial report](images/initalReport.png)

Let's look into how we fixed some of these issues.

## Properly sized images
Our first fix was modifying the disk's image element to feature a srcset of smaller images. It initially only had an image of it's full resolution (1920 x 1920) and so from there three more images of decreasing resolutions.

![srcset usage](images/imagesizefix.png)


## Visible text during font load
Following that, there was quick css required for our imported font otherwise the text of that font would be invisible until . The following line was added to circumvent this problem.
```css
font-display: swap;
```

![alt text](images/fontImportFix.png) 

## Text Compression
From there, the next stepw as to enable text compression on the server side. This was also a relatively simple change. After reading some documentation, the fix was found to be as follows:
```js
import compress from 'compression';

const app = express(); 
 
app.use(compress());
```
This was also a very large improvement for the lighthouse report. Lighthouse went from 71-82 after this change alone.