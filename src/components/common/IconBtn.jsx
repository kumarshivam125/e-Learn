import React from 'react'

export const IconBtn = ({
    text,onclick,children,disabled,outline=false,customClasses,type
}) => {
  return (
    <button onClick={onclick} disabled={disabled} type={type}>
        {
            children?
            (
                <>
                    <span>{text}</span>
                    {children}
                </>
            ): 
            {text}
        }
    </button>

  )
}
