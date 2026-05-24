import { useEffect, useRef, useState } from 'react';
import { Modal } from '@markec/mototrack-design.overlays.modal';
import { Heading } from '@markec/mototrack-design.typography.heading';
import { Paragraph } from '@markec/mototrack-design.typography.paragraph';
import { Card } from '@markec/mototrack-design.content.card';
import { Avatar } from '@markec/mototrack-design.content.avatar';
import { Badge } from '@markec/mototrack-design.content.badge';
import { Button } from '@markec/mototrack-design.actions.button';
import { IconButton } from '@markec/mototrack-design.actions.icon-button';
import { TextInput } from '@markec/mototrack-design.inputs.text-input';
import styles from './moto-chat.module.css';

type Message = { id: string; role: 'user' | 'assistant'; text: string };

const SUGGESTIONS = [
  '🌄 Predlagaj vijugasto pot po Soški dolini',
  '🌧️ Kakšno bo vreme jutri v Bovcu?',
  '🛡️ Pripravi seznam pred vožnjo na Vršič',
  '⛽ Najbližje gorivo na Transfăgărășan',
];

const SCRIPTED: Record<string, string> = {
  default: 'Sem MotoChat — tvoj AI pomočnik. Vprašaj me za predlog rute, vremensko napoved, pripravo na vožnjo ali katerokoli motoristično temo.',
  vrsic: '🏔️ Vršič serpentine — Pre-Ride:\n✓ Polna pnevmatika · ✓ Topla oblačila · ✓ Polno gorivo\n📍 85 km · 50 serpentin · 9.5/10\n🌤️ Jutri: 14°C, oblačno, brez padavin',
  soca: '🌊 Soška dolina: Tolmin→Kobarid→Bovec→Trenta→Vršič→Kranjska Gora\n120 km · ~4h 30min · Twisty 9.2/10',
  weather: '🌤️ Bovec jutri:\nZjutraj: 8°C ☀️ · Popoldne: 16°C 🌤️\nVeter: 12 km/h SZ · Padavine: 0%\n✅ Idealni pogoji',
  fuel: '⛽ Najbližje na Transfăgărășan:\n• Petrom · Curtea de Argeș — €1.42/L\n• OMV · Cârțișoara — €1.45/L\n• Lukoil · Sibiu — €1.38/L',
};

function pickReply(input: string): string {
  const t = input.toLowerCase();
  if (t.includes('vršič') || t.includes('vrsic')) return SCRIPTED.vrsic;
  if (t.includes('soš') || t.includes('soca') || t.includes('soča')) return SCRIPTED.soca;
  if (t.includes('vreme') || t.includes('bovc')) return SCRIPTED.weather;
  if (t.includes('gorivo') || t.includes('transf')) return SCRIPTED.fuel;
  return `Razmišljam: "${input}". Ali želiš predlog rute, vremensko napoved ali pripravo na vožnjo?`;
}

type Props = { onClose: () => void };

/** Floating MotoChat AI panel built on design system Modal + Card components. */
export function MotoChat({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm0', role: 'assistant', text: SCRIPTED.default },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: `u${prev.length}`, role: 'user', text: trimmed }]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: `a${prev.length}`, role: 'assistant', text: pickReply(trimmed) }]);
    }, 600);
  };

  return (
    <Modal open={true} onClose={onClose} size="md" closeOnBackdrop title="🧠 MotoChat AI">
      <div className={styles.chatBody}>
        <Card variant="elevated" padding="sm" className={styles.subHeader}>
          <Avatar name="MotoChat" size="sm" status="online" />
          <div>
            <Paragraph variant="body" color="primary">MotoChat AI</Paragraph>
            <Paragraph variant="caption" color="secondary">Slovenščina · iskanje po spletu</Paragraph>
          </div>
          <Badge label="Beta" variant="info" size="sm" />
        </Card>

        <div className={styles.messages}>
          {messages.map((m) => (
            <div key={m.id} className={`${styles.msgRow} ${m.role === 'user' ? styles.userRow : styles.aiRow}`}>
              <Card
                variant={m.role === 'user' ? 'elevated' : 'default'}
                padding="md"
                className={`${styles.msgCard} ${m.role === 'user' ? styles.userMsg : styles.aiMsg}`}
              >
                <Paragraph variant="body" color="primary" className={styles.msgText}>
                  {m.text}
                </Paragraph>
              </Card>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {messages.length <= 2 && (
          <div className={styles.suggestions}>
            {SUGGESTIONS.map((s) => (
              <Button
                key={s}
                variant="secondary"
                size="sm"
                onClick={() => send(s.replace(/^[^\s]+\s/, ''))}
              >
                {s}
              </Button>
            ))}
          </div>
        )}

        <form
          className={styles.inputBar}
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <div className={styles.inputWrap}>
            <TextInput
              placeholder="Vprašaj MotoChat..."
              value={input}
              onChange={setInput}
            />
          </div>
          <IconButton
            icon={<span>➤</span>}
            variant="filled"
            size="md"
            type="submit"
            aria-label="Send"
            disabled={!input.trim()}
          />
        </form>
      </div>
    </Modal>
  );
}
