import * as React from 'react'
import Cookies from 'universal-cookie'
import { NoSSR } from 'vtex.render-runtime'
import { Modal } from 'vtex.styleguide'
import { Newsletter } from 'vtex.store-components'

const cookies = new Cookies()

interface NewsletterModalProps {
  active: boolean
}

interface NewsletterModalState {
  isModalOpen: boolean
}

class NewsletterModal extends React.PureComponent<NewsletterModalProps, NewsletterModalState> {
  static defaultProps = {
    active: false,
  }

  public static schema = {
    title: 'editor.newsletterModal.configs.componentTitle',
    description: 'editor.newsletterModal.configs.componentDescription',
    type: 'object',
    properties: {
      active: {
        type: 'boolean',
        title: 'editor.newsletterModal.configs.active',
        default: NewsletterModal.defaultProps.active,
      },
      ...Newsletter.getSchema().properties,
    },
  }

  state = {
    isModalOpen: false,
  }

  componentDidMount() {
    if(this.props.active && !cookies.get('newsletterModalClosed')) {
      this.setState({
        isModalOpen: true
      })
    }
  }

  componentDidUpdate(prevProps) {
    if(!prevProps.active && this.props.active && !this.state.isModalOpen) {
      cookies.remove('newsletterModalClosed', { path: '/' })
      this.setState({
        isModalOpen: true
      })
    }
  }

  onClose = () => {
    cookies.set('newsletterModalClosed', true, { path: '/' })
    this.setState({
      isModalOpen: false
    })
  }
  
  render() {
    const { isModalOpen } = this.state
    const { active } = this.props

    if (!active) return null

    return (
      <NoSSR>
        <Modal centered isOpen={isModalOpen} onClose={this.onClose}>
          <Newsletter />
        </Modal>
      </NoSSR>
    )
  }
}

export default NewsletterModal
