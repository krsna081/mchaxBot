// © MchaX-Bot
// • Credits : wa.me/6281235807940 [ Krizz ]
// • Owner: 6281235807940

/*
• Telegram: krsna_081
• Instagram: krsna081
*/

async function events(m, { sock }) {
  if (m.type === "interactiveResponseMessage" && m.quoted.fromMe) {
    sock.appendTextMessage(
      m,
      JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id,
      m,
    );
  }
  if (m.type === "templateButtonReplyMessage" && m.quoted.fromMe) {
    sock.appendTextMessage(m, m.msg.selectedId, m);
  }
}

module.exports = {
  events,
};
