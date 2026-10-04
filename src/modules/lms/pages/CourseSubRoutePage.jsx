// src/modules/lms/pages/CourseSubRoutePage.jsx
import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { CourseDetailPage } from './CourseDetailPage'

export function CourseSubRoutePage({ tab = 'overview' }) {
  const { id } = useParams()
  return <Navigate to={`/lms/courses/${id}?tab=${tab}`} replace />
}
