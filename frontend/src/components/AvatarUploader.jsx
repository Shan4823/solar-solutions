import { useRef, useState } from 'react';
import { Camera, Trash2, Upload, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './AvatarUploader.module.css';

export default function AvatarUploader({ size = 88 }) {
  const { user, avatar, updateAvatar, removeAvatar } = useAuth();
  const inputRef  = useRef(null);
  const canvasRef = useRef(null);
  const [preview, setPreview]   = useState(null); // raw selected file preview
  const [zoom, setZoom]         = useState(1);
  const [dragging, setDragging] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [saving, setSaving]     = useState(false);

  // ── Open file picker ────────────────────────────────────────
  const pick = () => { inputRef.current.value = ''; inputRef.current.click(); };

  // ── File selected ───────────────────────────────────────────
  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return alert('Please select an image file.');
    if (file.size > 5 * 1024 * 1024) return alert('Image must be under 5 MB.');
    const reader = new FileReader();
    reader.onload = ev => { setPreview(ev.target.result); setZoom(1); setShowMenu(false); };
    reader.readAsDataURL(file);
  };

  // ── Drag-and-drop ───────────────────────────────────────────
  const onDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const fakeEv = { target: { files: [file] } };
    onFile(fakeEv);
  };

  // ── Crop + save: draw centred circle-crop onto canvas ───────
  const save = () => {
    if (!preview) return;
    setSaving(true);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const SIZE = 256;
      canvas.width = SIZE; canvas.height = SIZE;
      const ctx = canvas.getContext('2d');

      // circle clip
      ctx.beginPath();
      ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
      ctx.clip();

      // draw image centred + zoomed
      const scale  = zoom * Math.max(SIZE / img.width, SIZE / img.height);
      const drawW  = img.width  * scale;
      const drawH  = img.height * scale;
      const offX   = (SIZE - drawW) / 2;
      const offY   = (SIZE - drawH) / 2;
      ctx.drawImage(img, offX, offY, drawW, drawH);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      updateAvatar(user.id, dataUrl);
      setPreview(null);
      setSaving(false);
    };
    img.src = preview;
  };

  const cancel = () => { setPreview(null); setZoom(1); };
  const remove = () => { removeAvatar(user.id); setShowMenu(false); };

  const display = avatar;
  const initial = user?.full_name?.[0]?.toUpperCase() || 'U';

  // ── Preview / crop modal ────────────────────────────────────
  if (preview) {
    return (
      <div className={styles.cropModal}>
        <div className={styles.cropCard}>
          <div className={styles.cropHeader}>
            <span className={styles.cropTitle}>Adjust Photo</span>
            <button className={styles.cropClose} onClick={cancel}><X size={16} /></button>
          </div>

          {/* Preview circle */}
          <div className={styles.cropPreviewWrap}>
            <div className={styles.cropCircle}>
              <img
                src={preview}
                alt="preview"
                className={styles.cropImg}
                style={{ transform: `scale(${zoom})` }}
              />
            </div>
            <div className={styles.cropHint}>Drag to position • Use zoom to adjust</div>
          </div>

          {/* Zoom slider */}
          <div className={styles.zoomRow}>
            <ZoomOut size={15} color="var(--grey-5)" />
            <input
              type="range" min="1" max="3" step="0.05"
              value={zoom} onChange={e => setZoom(Number(e.target.value))}
              className={styles.zoomSlider}
            />
            <ZoomIn size={15} color="var(--grey-5)" />
          </div>

          <div className={styles.cropActions}>
            <button className={styles.cropCancel} onClick={cancel}>Cancel</button>
            <button className={styles.cropSave} onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save Photo'}
            </button>
          </div>
        </div>
        {/* Hidden canvas for rendering */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    );
  }

  // ── Normal avatar display ───────────────────────────────────
  return (
    <div className={styles.wrap} style={{ '--av-size': `${size}px` }}>
      <div
        className={`${styles.avatar} ${dragging ? styles.dragging : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => setShowMenu(v => !v)}
      >
        {display
          ? <img src={display} alt="avatar" className={styles.avatarImg} />
          : <span className={styles.avatarInitial}>{initial}</span>
        }
        <div className={styles.avatarOverlay}>
          <Camera size={18} />
        </div>
        {dragging && <div className={styles.dragOverlay}><Upload size={22} /></div>}
      </div>

      {showMenu && (
        <div className={styles.menu}>
          <button className={styles.menuItem} onClick={() => { pick(); setShowMenu(false); }}>
            <Camera size={14} /> Upload Photo
          </button>
          {display && (
            <button className={`${styles.menuItem} ${styles.menuItemDanger}`} onClick={remove}>
              <Trash2 size={14} /> Remove Photo
            </button>
          )}
        </div>
      )}

      <input
        ref={inputRef} type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        style={{ display: 'none' }} onChange={onFile}
      />
    </div>
  );
}
