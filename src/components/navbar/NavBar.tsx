import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { NavItem } from '../../models/NavItems'

const openRoutes: NavItem[] = [
    { name: 'SignIn', path: "/sign-in" },
    { name: 'SignUp', path: "/sign-up" },
]

const secureRoutes: NavItem[] = [
    { name: 'Movies', path: "/movies" },
    { name: 'Theatres', path: "/theatres" },
    { name: 'Shows', path: "/shows" },
    { name: 'MyBookings', path: "/bookings" },
    { name: 'Payments', path: "/payments" },
    { name: 'Users', path: "/users", roles: ["ADMIN"] },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export function NavBar() {
    const { isAuthenticated, role, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const cleanRole = role?.replace("ROLE_", "")
    const handleOnLogOut = () => {
        logout()
        navigate("/sign-in")
    }

   
    const visibleSecureRoutes = secureRoutes.filter(
        (item) => !item.roles || (cleanRole && item.roles.includes(cleanRole))
    )
    const routes = isAuthenticated ? visibleSecureRoutes : openRoutes

   
    const isCurrent = (path: string) => location.pathname.startsWith(path)

    return (
        <Disclosure
            as="nav"
            className="relative bg-green-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
        >
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
                        </DisclosureButton>
                    </div>

                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex shrink-0 items-center">
                            <NavLink to="/" className="text-xl font-bold text-white-500">
                                MovieBooking
                            </NavLink>
                        </div>

                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                {routes.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.path}
                                        aria-current={isCurrent(item.path) ? 'page' : undefined}
                                        className={classNames(
                                            isCurrent(item.path) ? 'bg-gray-950/50 text-white' : 'text-black-300 hover:bg-white/5 hover:text-white',
                                            'rounded-md px-3 py-2 text-sm font-medium',
                                        )}
                                    >
                                        {item.name}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {isAuthenticated &&
                            <button
                                type="button"
                                
                                className="relative rounded-full p-1 font-bold text-white-400 hover:text-white focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500"
                                
                                onClick={handleOnLogOut}
                            >
                               Logout
                            </button>
                        }
                    </div>
                </div>
            </div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {routes.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as={NavLink}
                            to={item.path}
                            aria-current={isCurrent(item.path) ? 'page' : undefined}
                            className={classNames(
                                isCurrent(item.path) ? 'bg-gray-950/50 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                                'block rounded-md px-3 py-2 text-base font-medium',
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    )
}