'use client'
import React from 'react'
import NextImage from 'next/image'
import { twMerge } from 'tailwind-merge'

interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  blurDataURL?: string
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  blurDataURL,
  ...props
}) => {
  const loading = priority ? 'eager' : 'lazy'

  return (
    <NextImage
      src={src}
      alt={alt}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      fill={fill}
      className={twMerge('object-cover', className)}
      loading={loading}
      priority={priority}
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
    />
  )
}
