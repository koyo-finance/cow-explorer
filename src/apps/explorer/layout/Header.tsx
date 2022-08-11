import { faEllipsisH, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FlexWrap } from 'apps/explorer/pages/styled'
import { ExternalLink } from 'components/analytics/ExternalLink'
import { Header as GenericHeader } from 'components/layout/GenericLayout/Header'
import { MenuBarToggle, Navigation } from 'components/layout/GenericLayout/Navigation'
import { NetworkSelector } from 'components/NetworkSelector'
import { ANALYTICS_LINK, APP_NAME, CORE_APP_LINK, DISCORD_LINK } from 'const'
import useOnClickOutside from 'hooks/useOnClickOutside'
import React, { createRef, useState } from 'react'
import { useHistory } from 'react-router'
import { PREFIX_BY_NETWORK_ID, useNetworkId } from 'state/network'

export const Header: React.FC = () => {
  const history = useHistory()
  const [isBarActive, setBarActive] = useState(false)
  const flexWrapDivRef = createRef<HTMLDivElement>()
  useOnClickOutside(flexWrapDivRef, () => isBarActive && setBarActive(false))

  const networkId = useNetworkId()
  if (!networkId) {
    return null
  }

  const prefixNetwork = PREFIX_BY_NETWORK_ID.get(networkId)

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault()
    setBarActive(false)
    history.push(`/${prefixNetwork || ''}`)
  }

  return (
    <GenericHeader logoAlt="Momiji Explorer" linkTo={`/${prefixNetwork || ''}`}>
      <NetworkSelector networkId={networkId} />
      <FlexWrap ref={flexWrapDivRef} grow={1}>
        <MenuBarToggle isActive={isBarActive} onClick={(): void => setBarActive(!isBarActive)}>
          <FontAwesomeIcon icon={isBarActive ? faTimes : faEllipsisH} />
        </MenuBarToggle>
        <Navigation isActive={isBarActive}>
          <li>
            <a onClick={(e): void => handleNavigate(e)}>Home</a>
          </li>
          <li>
            <ExternalLink target={'_blank'} href={CORE_APP_LINK}>
              {APP_NAME}
            </ExternalLink>
          </li>
          <li>
            <ExternalLink target={'_blank'} href={DISCORD_LINK}>
              Community
            </ExternalLink>
          </li>
          <li>
            <ExternalLink target={'_blank'} href={ANALYTICS_LINK}>
              Analytics
            </ExternalLink>
          </li>
        </Navigation>
      </FlexWrap>
    </GenericHeader>
  )
}
