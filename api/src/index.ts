import express from 'express'
import { Database } from 'sqlite3'
import diff from './diff'
import http from './http_v2'

const port = process.env.PORT || 8080
http.use(express.json({ limit: '4mb' }))
http.listen(port, () => console.log(`0.0.0.0:${port}`))
