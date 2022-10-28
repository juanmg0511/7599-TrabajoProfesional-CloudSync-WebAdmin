import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// CloudSync
const AdminUsers = React.lazy(() => import('./views/admin-users'))
const AdminEdit = React.lazy(() => import('./views/admin-users/edit'))
const Users = React.lazy(() => import('./views/users'))
const UsersEdit = React.lazy(() => import('./views/users/edit'))
const Sessions = React.lazy(() => import('./views/sessions'))
const SessionsEdit = React.lazy(() => import('./views/sessions/edit'))
const Recovery = React.lazy(() => import('./views/recovery'))
const RecoveryEdit = React.lazy(() => import('./views/recovery/edit'))
const GameProgress = React.lazy(() => import('./views/game-progress'))
const GameProgressEdit = React.lazy(() => import('./views/game-progress/edit'))
const Highscores = React.lazy(() => import('./views/highscores'))
const HighscoresEdit = React.lazy(() => import('./views/highscores/edit'))
const RequestLog = React.lazy(() => import('./views/request-log'))
const About = React.lazy(() => import('./views/about'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/admin-users', name: 'Admin Users', element: AdminUsers },
  { path: '/admin-users/edit', name: 'Admin Edit', element: AdminEdit },
  { path: '/users', name: 'Users', element: Users },
  { path: '/users/edit', name: 'User Edit', element: UsersEdit },
  { path: '/sessions', name: 'Sessions', element: Sessions },
  { path: '/sessions/edit', name: 'Session Edit', element: SessionsEdit },
  { path: '/recovery', name: 'Recovery', element: Recovery },
  { path: '/recovery/edit', name: 'Recovery Edit', element: RecoveryEdit },
  { path: '/game-progress', name: 'Game Progress', element: GameProgress },
  { path: '/game-progress/edit', name: 'Game Progress Edit', element: GameProgressEdit },
  { path: '/highscores', name: 'Highscores', element: Highscores },
  { path: '/highscores/edit', name: 'Highscore Edit', element: HighscoresEdit },
  { path: '/request-log', name: 'Request Log', element: RequestLog },
  { path: '/about', name: 'About', element: About },
]

export default routes
