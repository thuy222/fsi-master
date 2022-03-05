import React from 'react'
import Icon from '@ant-design/icons';

const SVGIcon = ({icon, className, style}) => {
    const IconComponent = () => <img src={icon} />
    return (<Icon className={className} style={style} component={IconComponent}/>
  )
}

export default SVGIcon