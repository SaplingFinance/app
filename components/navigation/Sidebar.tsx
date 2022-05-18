import Link from 'next/link'
import {
    COLOR_GREEN,
    networks,
    rgba,
    rgbGreen,
    RPC_NETWORK_ID,
    SIDEBAR_ALWAYS_VISIBLE_WIDTH,
    useAccount,
} from '../../app'
import {
    NAV_HEIGHT,
    SIDEBAR_CLOSE_MARGIN,
    SIDEBAR_CLOSE_SIZE,
    SIDEBAR_MAX_WIDTH,
} from './constants'
import { GrClose } from 'react-icons/gr'
import { TiChartAreaOutline } from 'react-icons/ti'
import { AiFillBank } from 'react-icons/ai'
import { RiAccountCircleFill } from 'react-icons/ri'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import { FaFaucet } from 'react-icons/fa'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { selectPools } from '../../features'

export function Sidebar({
    isVisible,
    hideSidebar,
}: {
    isVisible: boolean
    hideSidebar: () => void
}) {
    const { pathname } = useRouter()
    const account = useAccount()
    const pools = useSelector(selectPools)
    const isManager = useMemo(
        () =>
            Object.values(pools).filter(
                (pool) => pool.managerAddress === account,
            ).length > 0,
        [pools, account],
    )

    return (
        <div className="sidebar">
            <style jsx>{`
                .sidebar {
                    background-color: var(--bg-color);
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    z-index: 2;
                    padding-top: ${NAV_HEIGHT}px;
                    display: ${isVisible ? 'block' : 'none'};

                    > :global(.close-button) {
                        position: absolute;
                        top: ${SIDEBAR_CLOSE_MARGIN}px;
                        right: ${SIDEBAR_CLOSE_MARGIN}px;
                        > :global(path) {
                            stroke: var(--color-secondary);
                        }
                    }

                    > .overlay {
                        display: none;
                        z-index: 1;
                        position: fixed;
                        top: 0;
                        bottom: 0;
                        margin-left: ${SIDEBAR_MAX_WIDTH}px;
                        width: 100%;
                        height: 100vh;
                        background-color: rgba(0, 0, 0, 0.5);
                    }
                }

                ul {
                    list-style: none;
                    margin: 20px 20px;
                    padding: 0;
                }

                .sidebar-button {
                    display: flex;
                    align-items: center;
                    margin: 4px 0;
                    padding: 8px 10px;
                    cursor: default;
                    border-radius: 8px;
                    color: var(--color-secondary);

                    > :global(svg) {
                        margin-right: 10px;
                    }

                    &.current,
                    &:hover {
                        color: ${rgbGreen};
                        background-color: ${rgba(COLOR_GREEN, 0.08)};
                    }
                }

                @media screen and (min-width: ${SIDEBAR_MAX_WIDTH}px) {
                    .sidebar {
                        width: ${SIDEBAR_MAX_WIDTH}px;
                        border-right: 1px solid var(--divider);

                        > .overlay {
                            display: block;
                        }
                    }
                }

                @media screen and (min-width: ${SIDEBAR_ALWAYS_VISIBLE_WIDTH}px) {
                    .sidebar {
                        display: block;

                        > :global(.close-button) {
                            display: none;
                        }

                        > .overlay {
                            display: none;
                        }
                    }

                    :global(#__next) {
                        padding-left: ${SIDEBAR_MAX_WIDTH}px;
                    }
                }
            `}</style>

            <GrClose
                className="close-button"
                onClick={hideSidebar}
                size={SIDEBAR_CLOSE_SIZE}
            />

            <ul>
                <li>
                    <Link href="/">
                        <a
                            className={getSidebarItemClass(
                                '/earn',
                                pathname,
                                true,
                            )}
                            onClick={hideSidebar}
                        >
                            <TiChartAreaOutline size={24} />
                            Earn
                        </a>
                    </Link>
                </li>
                <li>
                    <Link href="/borrow">
                        <a
                            className={getSidebarItemClass('/borrow', pathname)}
                            onClick={hideSidebar}
                        >
                            <AiFillBank size={24} />
                            Borrow
                        </a>
                    </Link>
                </li>
                {isManager && (
                    <li>
                        <Link href="/manage">
                            <a
                                className={getSidebarItemClass(
                                    '/manage',
                                    pathname,
                                )}
                                onClick={hideSidebar}
                            >
                                <MdOutlineAdminPanelSettings size={24} />
                                Manage
                            </a>
                        </Link>
                    </li>
                )}
                {RPC_NETWORK_ID === networks.optimismKovan ? (
                    <li>
                        <a
                            className={getSidebarItemClass('/faucet', pathname)}
                            onClick={hideSidebar}
                            href="https://kovan.optifaucet.com"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <FaFaucet size={24} style={{ padding: 4 }} />
                            Faucet
                        </a>
                    </li>
                ) : null}
                <li>
                    <Link href="/account">
                        <a
                            className={getSidebarItemClass(
                                '/account',
                                pathname,
                            )}
                            onClick={hideSidebar}
                        >
                            <RiAccountCircleFill size={24} />
                            Account
                        </a>
                    </Link>
                </li>
            </ul>

            <div className="overlay" onClick={hideSidebar} />
        </div>
    )
}

function getSidebarItemClass(
    href: string,
    currentPath: string,
    home?: boolean,
) {
    return `sidebar-button${
        currentPath.startsWith(href) || (home && currentPath === '/')
            ? ' current'
            : ''
    }`
}
