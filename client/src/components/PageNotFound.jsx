import error404 from '../assets/svgs/error404.svg'
import SpecialFooter from './SpecialFooter';

export default function PageNotFound() {
  return (
    <div className="Error">
      <div className="container">
        <section>
          <img src={error404} alt="404 Image" />
          <div className="errorDescription">
            <div className="errorhead">
              Oops,<br />
              <span>nothing</span> here...
            </div>
            <div className="errorbody">
              Uh oh,we can't seem to find the page you're looking for. <br />
              Try going back to previous page or contact us for more information.
            </div>
          </div>
        </section>
      </div>
      <SpecialFooter />
    </div>
  )
}
