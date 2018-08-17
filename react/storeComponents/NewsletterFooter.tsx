import * as React from 'react'

interface NewsletterFooterProps {

}

class NewsletterFooter extends React.Component<NewsletterFooterProps, {}> {
  render() {
    return (
      <div className="">
        <div>Newsletter</div>
        <div>
          <input placeholder="E-mail" />
        </div>
      </div>
    )
  }
}

export default NewsletterFooter
