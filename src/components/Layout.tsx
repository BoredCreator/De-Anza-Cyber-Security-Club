import { Outlet } from 'react-router-dom'
import PageHeader from './PageHeader'
import Footer from './Footer'

function Layout() {
  return (
    <>
      <div className="relative z-50">
        <div className="max-w-5xl mx-auto px-6 pt-6">
          <PageHeader />
        </div>
      </div>
      <Outlet />
      <div className="max-w-5xl mx-auto px-6 pb-6">
        <Footer />
      </div>
    </>
  )
}

export default Layout
