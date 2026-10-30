// Render cả metadata lẫn nội dung ngay trong HTML, kể cả khi bot chia sẻ không chạy JS.
export function renderInvitationHtml(template, invitation) {
  const values = {
    DAY: String(invitation.day),
    WEEKDAY: invitation.weekday,
    SIDE: invitation.sideLabel,
    PREFIX: invitation.prefix,
  }
  return template.replace(/__WEDDING_(DAY|WEEKDAY|SIDE|PREFIX)__/g, (_, key) => values[key])
    .replaceAll('qr-groom-techcombank.png', invitation.selectedGift.qrFile)
}
