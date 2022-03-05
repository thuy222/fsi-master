import styled from 'styled-components'

export const MaterialInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px;

  .input-block {
    display: flex;
    align-items: center;
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 50px white inset;
      -webkit-text-fill-color: ${(props) => props.theme.colors?.black};
    }
    input:-webkit-autofill::first-line {
      font-size: 14px;
    }

    .input-loading {
      cursor: wait;
    }

    textarea {
      resize: none;
    }

    input,
    textarea {
      background: none;
      color: ${(props) => props.theme.colors?.primary};
      font-size: 14px;
      font-weight: 600;
      padding: 8px 8px 8px 0;
      display: block;
      width: 100%;
      border: none;
      border-radius: 0;
      &:focus {
        outline: none;
      }
      &:focus ~ .bar:before {
        width: 100%;
      }
    }

    .extra-content {
      display: flex;
      top: 0;
      right: 0;
      height: 100%;
      align-items: center;
      padding-right: 8px;
      user-select: none;
      color: ${(props) => props.theme.colors?.textColors?.titles};

      .toggle-password {
        font-size: 1.2rem;
      }
    }
  }

  label {
    font-weight: 600;
    pointer-events: none;
    left: 5px;
    color: ${(props) => props.theme.colors?.textColors?.titles};
  }

  .bar {
    position: absolute;
    bottom: 0;
    display: block;
    width: 100%;
    border-bottom: 1px solid ${(props) => props.theme.colors?.grey};
    &:before {
      content: '';
      height: 2px;
      width: 0;
      top: 0;
      position: absolute;
      background: ${(props) => props.theme.colors?.primary};
      transition: 300ms ease all;
      left: 0;
    }
  }
`
