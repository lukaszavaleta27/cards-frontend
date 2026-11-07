import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';

const API_URL = 'https://cards-api.lukaszavaleta.xyz';

type Card = {
  _id: string;
  playerName?: string;
  teamName?: string;
  cardValue?: number;
  publisher?: string;
  card?: string;
};

type CardsPageProps = {
  onLogout: () => void;
};

function CardsPage({ onLogout }: CardsPageProps) {
  const token = sessionStorage.getItem('cardsToken');
  const userId = sessionStorage.getItem('cardsUserId');

  const [cards, setCards] = useState<Card[]>([]);
  const [search, setSearch] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [cardValue, setCardValue] = useState('0');
  const [publisher, setPublisher] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCards = useCallback(async (term = '') => {
    if (!token || !userId) {
      setMessage('Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const query = term
        ? `?search=${encodeURIComponent(term)}`
        : '';

      const response = await fetch(
        `${API_URL}/api/users/${userId}/cards${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load cards');
      }

      setCards(data);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to load cards'
      );
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
  const timer = window.setTimeout(() => {
    void loadCards();
  }, 0);

  return () => window.clearTimeout(timer);
}, [loadCards]);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setLoading(true);
    await loadCards(search);
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !userId) {
      setMessage('Please log in again.');
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/users/${userId}/cards`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            playerName,
            teamName,
            cardValue: Number(cardValue),
            publisher,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add card');
      }

      setPlayerName('');
      setTeamName('');
      setCardValue('0');
      setPublisher('');
      setMessage('Card added successfully!');

      await loadCards(search);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to add card'
      );
    }
  }

  async function handleEdit(card: Card) {
  if (!token) {
    setMessage('Please log in again.');
    return;
  }

  const newName = window.prompt(
    'Enter the updated card name:',
    card.playerName || card.card || ''
  );

  if (newName === null) return;

  if (!newName.trim()) {
    setMessage('Card name cannot be empty.');
    return;
  }

  const field = card.playerName !== undefined ? 'playerName' : 'card';

  try {
    const response = await fetch(
      `${API_URL}/api/cards/${card._id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          [field]: newName.trim(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update card');
    }

    setMessage('Card updated successfully!');
    await loadCards(search);
  } catch (error) {
    setMessage(
      error instanceof Error ? error.message : 'Unable to update card'
    );
  }
}

  async function handleDelete(cardId: string) {
    if (!token) return;

    if (!window.confirm('Are you sure you want to delete this card?')) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/cards/${cardId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete card');
      }

      setMessage('Card deleted successfully!');
      await loadCards(search);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to delete card'
      );
    }
  }

  return (
    <main>
      <h1>My Baseball Cards</h1>

      <button type="button" onClick={onLogout}>
        Log Out
      </button>

      <hr />

      <section>
        <h2>Add a Card</h2>

        <form onSubmit={handleAdd}>
          <div>
            <input
              type="text"
              placeholder="Player Name"
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
            />
          </div>

          <div>
            <input
              type="number"
              placeholder="Card Value"
              value={cardValue}
              onChange={(event) => setCardValue(event.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Publisher"
              value={publisher}
              onChange={(event) => setPublisher(event.target.value)}
            />
          </div>

          <button type="submit">Add Card</button>
        </form>
      </section>

      <hr />

      <section>
        <h2>My Collection</h2>

        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search cards..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <button type="submit">Search</button>

          <button
            type="button"
            onClick={() => {
              setSearch('');
              setLoading(true);
              void loadCards();
            }}
          >
            Show All
          </button>
        </form>

        {loading && <p>Loading cards...</p>}

        {!loading && cards.length === 0 && (
          <p>No cards found.</p>
        )}

        <ul>
          {cards.map((card) => (
            <li key={card._id}>
              <strong>{card.playerName || card.card}</strong>

              {card.teamName && ` — ${card.teamName}`}

              {card.cardValue !== undefined && (
                <span> — ${card.cardValue.toFixed(2)}</span>
              )}

              {card.publisher && (
                <span> — {card.publisher}</span>
              )}

              {' '}
<button
  type="button"
  onClick={() => void handleEdit(card)}
>
  Edit
</button>

{' '}
<button
  type="button"
  onClick={() => void handleDelete(card._id)}
>
  Delete
</button>
            </li>
          ))}
        </ul>
      </section>

      <p role="status">{message}</p>
    </main>
  );
}

export default CardsPage;