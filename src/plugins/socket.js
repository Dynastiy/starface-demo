import config from '@/axios/config'
import { io } from 'socket.io-client'

const socket = io(config.apiUrl) // Backend server URL

export default socket
