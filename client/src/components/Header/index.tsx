import React from 'react'
import styled from 'styled-components'

import { Customizer } from 'office-ui-fabric-react/lib/Utilities'
import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react/lib/CommandBar'
import { PersonaSize, PersonaCoin } from 'office-ui-fabric-react/lib/Persona'

import SolutionSettings from './SolutionSettings'
import { headerTheme } from '../../theme'

const HeaderWrapper = styled.header`
  grid-area: header;
  background-color: ${props => props.theme.primary};
`

export interface IHeaderFromRedux {
  profilePicUrl?: string
  editSolution: (
    solutionId: string,
    solution: Partial<IEditableSolutionProperties>,
  ) => void
  isSettingsView: boolean
  isLoggedIn: boolean
  login: () => void
  logout: () => void
  deleteSolution: () => void
  createPublicGist: () => void
  createSecretGist: () => void
  updateGist: () => void
}

export interface IHeader extends IHeaderFromRedux {
  showBackstage: () => void
  solution: ISolution
}

interface IState {
  showSolutionSettings: boolean
}

class Header extends React.Component<IHeader, IState> {
  state = { showSolutionSettings: false }

  render() {
    const {
      solution,
      showBackstage,
      editSolution,
      deleteSolution,
      isSettingsView,
      profilePicUrl,
      isLoggedIn,
      logout,
      login,
      updateGist,
      createPublicGist,
      createSecretGist,
    } = this.props

    const solutionName = solution ? solution.name : 'Solution Name'

    const shareOptions = [
      {
        hidden: !(solution.source && solution.source.origin === 'gist'),
        key: 'update-gist',
        text: 'Update existing gist',
        iconProps: { iconName: 'Save' },
        onClick: updateGist,
      },
      {
        key: 'new-public-gist',
        text: 'New public gist',
        iconProps: { iconName: 'PageCheckedIn' },
        onClick: createPublicGist,
      },
      {
        key: 'new-secret-gist',
        text: 'New secret gist',
        iconProps: { iconName: 'ProtectedDocument' },
        onClick: createSecretGist,
      },
    ]
      .filter(option => !option.hidden)
      .map(option => {
        const { hidden, ...rest } = option
        return rest
      })

    const nonSettingsButtons: ICommandBarItemProps[] = [
      {
        key: 'run',
        text: 'Run',
        iconProps: { iconName: 'Play' },
        href: '/run.html',
      },
      {
        key: 'share',
        text: 'Share',
        iconProps: { iconName: 'Share' },
        subMenuProps: {
          items: shareOptions,
        },
      },
      {
        key: 'delete',
        text: 'Delete',
        iconProps: { iconName: 'Delete' },
        onClick: deleteSolution,
      },
    ]

    const commonItems: ICommandBarItemProps[] = [
      {
        key: 'nav',
        iconOnly: true,
        iconProps: { iconName: 'GlobalNavButton' },
        onClick: showBackstage,
      },
      {
        key: solutionName,
        text: solutionName,
        onClick: isSettingsView ? undefined : this.openSolutionSettings,
      },
    ]

    const items: ICommandBarItemProps[] = [
      ...commonItems,
      ...(isSettingsView ? [] : nonSettingsButtons),
    ].filter(item => item !== null)

    const profilePic = {
      key: 'account',
      onRenderIcon: () => (
        <div style={{ width: '28px', overflow: 'hidden' }}>
          <PersonaCoin
            imageUrl={profilePicUrl}
            size={PersonaSize.size28}
            styles={{
              coin: { backgroundColor: 'brick' },
              image: { backgroundColor: 'white' },
              initials: {
                backgroundColor: '#000',
                color: 'green',
              },
            }}
          />
        </div>
      ),
      subMenuProps: isLoggedIn
        ? {
            items: [
              {
                key: 'logout',
                text: 'Logout',
                onClick: logout,
              },
            ],
          }
        : undefined,
      iconOnly: true,
      onClick: login,
    }

    return (
      <>
        <Customizer settings={{ theme: headerTheme }}>
          <HeaderWrapper>
            <CommandBar
              items={items}
              styles={{
                root: { paddingLeft: 0, paddingRight: 0 },
              }}
              farItems={[profilePic]}
            />
          </HeaderWrapper>
        </Customizer>

        {solution && (
          <SolutionSettings
            isOpen={this.state.showSolutionSettings}
            closeSolutionSettings={this.closeSolutionSettings}
            solution={solution}
            editSolutionMetadata={editSolution}
          />
        )}
      </>
    )
  }

  private openSolutionSettings = () => this.setState({ showSolutionSettings: true })
  private closeSolutionSettings = () => this.setState({ showSolutionSettings: false })
}

export default Header