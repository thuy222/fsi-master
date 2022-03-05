import styled from 'styled-components'

export const AuthenticationLayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;

  .content-wrapper {
    display: flex;
    flex: 1;

    .container-center-wrapper {
      z-index: 101;
      display: flex;
      flex: 6;
      flex-direction: column;
      max-width: 500px;
      margin: auto;
      width: 100%;
      padding: 8px 16px;

      :before {
        display: flex;
        flex: 0;
        content: ' ';
      }

      :after {
        display: flex;
        flex: 3;
        content: ' ';
      }
    }

    .container-center-wrapper.balance {
      :before {
        flex: 1;
        ${(props) => props.theme.media['xs']} {
          flex: 0;
        }
      }
    }

    .container-center-wrapper.alway-balance {
      :before {
        flex: 1;
      }
    }

    .container-full {
      display: flex;
      flex: 1;
      flex-direction: column;
    }
  }

  .footer {
    display: flex;
    padding: 8px;
    position: relative;
    font-size: 10px;
    .branch {
      margin: 0 auto;
    }
  }
`
export const IframeLayoutContainer = styled(AuthenticationLayoutContainer)`
  width: unset;
  min-height: unset;
  display: block;
  align-items: unset;
  padding: 8px 24px 0px 0px;

  .content {
    max-width: unset;
    width: unset;
    display: flex;
    flex-direction: row-reverse;
  }
`
