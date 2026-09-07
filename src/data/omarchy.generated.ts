// Generated seed from PUBLIC GitHub PR metadata. The scheduled sync replaces this file.
// Do not place secrets or private-account data in this file.

export type OmarchyPullRequest = {
  number: number
  title: string
  state: 'open' | 'merged' | 'closed'
  createdAt: string
  updatedAt: string
  href: string
  issue: string | null
  test: string | null
}

export const omarchyPullRequests: OmarchyPullRequest[] = [
  { number: 10623, title: 'Fix explicit bar toggle direction', state: 'open', createdAt: '2026-09-07T00:00:00Z', updatedAt: '2026-09-07T00:00:00Z', href: 'https://github.com/omacom/omarchy/pull/10623', issue: '#10621', test: 'test/shell.d/toggle-test.sh' },
  { number: 10535, title: 'Use Ctrl+V for clipboard image paste', state: 'open', createdAt: '2026-09-06T00:00:00Z', updatedAt: '2026-09-06T00:00:00Z', href: 'https://github.com/omacom/omarchy/pull/10535', issue: '#10526', test: 'test/shell.d/clipboard-file-paste-test.sh' },
  { number: 10513, title: 'Drop browser codec preloads from yt-dlp host', state: 'open', createdAt: '2026-09-06T00:00:00Z', updatedAt: '2026-09-06T00:00:00Z', href: 'https://github.com/omacom/omarchy/pull/10513', issue: '#10469', test: 'test/shell.d/chromium-ytdlp-preload-test.sh' },
  { number: 10501, title: 'Keep Bluetooth device actions on the panel adapter', state: 'open', createdAt: '2026-09-06T00:00:00Z', updatedAt: '2026-09-06T00:00:00Z', href: 'https://github.com/omacom/omarchy/pull/10501', issue: '#10479', test: 'test/shell.d/bluetooth-multi-adapter-test.sh' },
  { number: 10497, title: 'Restore GVfs mounts after system resume', state: 'open', createdAt: '2026-09-06T00:00:00Z', updatedAt: '2026-09-06T00:00:00Z', href: 'https://github.com/omacom/omarchy/pull/10497', issue: '#10450', test: 'test/shell.d/unmount-fuse-test.sh' },
  { number: 10490, title: 'Scope 1Password floating geometry to main window', state: 'open', createdAt: '2026-09-06T00:00:00Z', updatedAt: '2026-09-06T00:00:00Z', href: 'https://github.com/omacom/omarchy/pull/10490', issue: '#9904', test: 'test/shell.d/hyprland-1password-rules-test.sh' },
]
