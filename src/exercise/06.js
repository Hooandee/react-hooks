// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import {PokemonForm} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [state, setState] = React.useState('idle')

  React.useEffect(() => {
    setState('pending')
    const getPokemon = async () => {
      return await fetchPokemon(pokemonName).then(
        pokemonData => {
          setPokemon(pokemonData)
          setState('resolved')
        },
        error => {
          setError(error)
          throw error
        },
      )
    }
    if (pokemonName) {
      getPokemon()
    }
  }, [pokemonName, setError])

  switch (state) {
    case 'idle':
      return 'Submit a Pokémon'
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'resolved':
      return <PokemonDataView pokemon={pokemon} />
    case 'rejected':
      return (
        <div role={'alert'}>
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
        </div>
      )
    default:
      return 'Default state'
  }
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
    }
  }

  static getDerivedStateFromError(error) {
    return {error}
  }

  componentDidCatch(error, errorInfo) {
    return {error}
  }

  render() {
    if (this.state.error) {
      return (
        <>
          <div role="alert">The app has encountered an Error</div>
          <pre>{this.error}</pre>
        </>
      )
    } else {
      return this.props.children
    }
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
