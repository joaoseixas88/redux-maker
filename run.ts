import { makeAll } from './script'
import { dirname, resolve } from 'path'
import { readdir } from 'fs/promises'

const path = resolve('../', 'portal-gestor-gazin', 'src', 'redux')



makeAll('get rank relatorios ranking assessorias', path)