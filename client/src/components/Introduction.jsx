
/**
 * Provides an introduction to the website along with the title and logo
 * @returns title and introduction
 */
export default function Introduction() {
  
  return (
    <header id="title-box" className="transparent-background">
      <h1 className="title">On the Record</h1>
      <h3>An <span className="on-beat">on-beat</span> data driven story about music genre shifts in the Billboard top 100 and Spotify streaming numbers between 2010 and 2021</h3>
      <hr></hr>
      <p>Scroll to see the story, spinning the record can be used to scroll faster.</p>
    </header>
  )
}
