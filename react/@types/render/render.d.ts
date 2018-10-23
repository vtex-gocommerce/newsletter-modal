/// <reference types="react" />

interface LinkProps {
  query?: String
  to?: String
  page?: String
  onClick?: Function
  className?: string
  params?: { [name: string]: any }
}

interface ExtensionContainerProps {
  id?: String
  [name:string]: any
}

interface ExtensionPointProps {
  id?: String
  [name:string]: any
}

declare namespace Render {
  import _React = React
  export class Link extends _React.Component<LinkProps, any> {
    render()
  }
  export class ExtensionContainer extends _React.Component<ExtensionContainerProps, any> {}
  export class ExtensionPoint extends React.Component<ExtensionPointProps, any> {}
  export class Helmet extends React.Component<any, any> {
    render()
  }
  export class RenderContextConsumer extends React.Component<any, any> {
    render()
  }
  export class NoSSR extends React.Component<any, any> {
    render()
  }
}

declare module 'render' {
  export = Render
}

declare module "*.gql" {
  const value: any;
  export default value;
}

declare module "gocommerce.*"
declare module "vtex.*"
