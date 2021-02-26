var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1.5,
    canvas = document.getElementById('the-canvas'),
    ctx = canvas.getContext('2d');


// /**
//  * Get page info from document, resize canvas accordingly, and render page.
//  * @param num Page number. 
//  * */
function renderPage(num,scale) {
    pageRendering = true;
    // Using promise to fetch the page
    pdfDoc.getPage(num).then(function(page) {

      var viewport = page.getViewport({scale: scale});
      canvas.height = viewport.height;
      canvas.width = viewport.width;
  
      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };
      var renderTask = page.render(renderContext);
      
      // Wait for rendering to finish
      renderTask.promise.then(function() {
        pageRendering = false;
        if (pageNumPending !== null) {
          // New page rendering is pending
          renderPage(pageNumPending,scale);
          pageNumPending = null;
        }
      }).then(function() {
        // Returns a promise, on resolving it will return text contents of the page
        return page.getTextContent();
      }).then(function(textContent) {
            // Assign CSS to the textLayer element
            var textLayer = document.querySelector(".textLayer");

            textLayer.style.left = canvas.offsetLeft + 'px';
            textLayer.style.top = canvas.offsetTop + 'px';
            textLayer.style.height = canvas.offsetHeight + 'px';
            textLayer.style.width = canvas.offsetWidth + 'px';
      
            // Pass the data to the method for rendering of text over the pdf canvas.
            pdfjsLib.renderTextLayer({
              textContent: textContent,
              container: textLayer,
              viewport: viewport,
              textDivs: []
            });
        });
    });
  
    // Update page counters
    document.getElementById('page_num').textContent = num;
  }

  /**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
    if (pageRendering) {
      pageNumPending = num;
    } else {
      renderPage(num,scale);
    }
  }
  
  /**
   * Displays previous page.
   */
  function onPrevPage() {
    if (pageNum <= 1) {
      return;
    }
    pageNum--;
    queueRenderPage(pageNum);
  }
  document.getElementById('prev').addEventListener('click', onPrevPage);

  /**
 * Displays next page.
 */
function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
      return;
    }
    pageNum++;
    queueRenderPage(pageNum);
  }
  document.getElementById('next').addEventListener('click', onNextPage);
  
  /**
   * Asynchronously downloads PDF.
   */

var loadingTask = pdfjsLib.getDocument('file.pdf');
loadingTask.promise.then(function(pdfDoc_) {
  // you can now use *pdf* here
    pdfDoc = pdfDoc_;
    document.getElementById('page_count').textContent = pdfDoc.numPages;
  
    // Initial/first page rendering
    renderPage(pageNum,scale);

});

document.querySelector('.fa-plus').addEventListener('click',function(){
loadingTask.promise.then(function(pdfDoc_) {
  // you can now use *pdf* here
    pdfDoc = pdfDoc_;
    document.getElementById('page_count').textContent = pdfDoc.numPages;
  
    // Initial/first page rendering
    window.scale = window.scale+0.2;
    renderPage(pageNum,scale);

});
})
document.querySelector('.fa-minus').addEventListener('click',function(){
  loadingTask.promise.then(function(pdfDoc_) {
    // you can now use *pdf* here
      pdfDoc = pdfDoc_;
      document.getElementById('page_count').textContent = pdfDoc.numPages;
    
      // Initial/first page rendering
      window.scale = window.scale-0.2;
      renderPage(pageNum,scale);
  
  });
  });
  var degree = 0;
  document.querySelector('.fa-sync').addEventListener('click',function(){
    window.degree = degree + 90;
    document.getElementById('container').style.transform = `rotate(${degree}deg)`;
  })