import * as React from 'react'
import { graphql, compose } from 'react-apollo'
import Cookies from 'universal-cookie'
import { NoSSR } from 'vtex.render-runtime'
import { Modal } from 'vtex.styleguide'
import { Newsletter } from 'vtex.store-components'

import addNewsletterOmsProfile from './graphql/addNewsletterOmsProfile.gql'

const cookies = new Cookies()

interface NewsletterModalProps {
  active: boolean
  boxTitle: string
  boxIntro: string
  boxComplete: string
  boxSend: string
  addNewsletterOmsProfile: Function
  app: any
}

interface NewsletterModalState {
  isModalOpen: boolean
}

class NewsletterModal extends React.PureComponent<NewsletterModalProps, NewsletterModalState> {
  static defaultProps = {
    active: false,
    boxTitle: 'Newsletter',
    boxIntro: 'Se inscreva em nossa newsletter e receba promoções',
    boxComplete: 'Cadastro realizado com sucesso!',
    boxSend: 'Enviar'
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

const NewsletterModalWithIntl = compose(
  graphql(addNewsletterOmsProfile, {
    name: 'addNewsletterOmsProfile',
  }),
)(NewsletterModal)

NewsletterModalWithIntl.schema = {
  title: 'editor.newsletterModal.configs.componentTitle',
  description: 'editor.newsletterModal.configs.componentDescription',
  type: 'object',
  properties: {
    active: {
      type: 'boolean',
      title: 'editor.newsletterModal.configs.active',
      default: NewsletterModal.defaultProps.active,
    },
    boxTitle: {
      type: 'string',
      title: 'editor.newsletterModal.configs.title',
      default: NewsletterModal.defaultProps.boxTitle,
      isLayout: true,
    },
    boxIntro: {
      type: 'string',
      title: 'editor.newsletterModal.configs.intro',
      default: NewsletterModal.defaultProps.boxIntro,
      isLayout: true,
    },
    boxComplete: {
      type: 'string',
      title: 'editor.newsletterModal.configs.complete',
      default: NewsletterModal.defaultProps.boxComplete,
      isLayout: true,
    },
    boxSend: {
      type: 'string',
      title: 'editor.newsletterModal.configs.send',
      default: NewsletterModal.defaultProps.boxSend,
      isLayout: true,
    },
  },
}

export default NewsletterModalWithIntl
