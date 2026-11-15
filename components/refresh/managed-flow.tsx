export function ManagedFlow() {
  return (
    <figure className="rf-flow" aria-labelledby="managed-flow-title">
      <figcaption id="managed-flow-title">Ihre Website. Ich kümmere mich um den Rest.</figcaption>
      <div className="rf-flow-window">
        <div className="rf-flow-toolbar"><span aria-hidden="true">● ● ●</span><span>Ihre Website</span><span aria-hidden="true">↗</span></div>
        <div className="rf-flow-scene" aria-hidden="true">
          <div className="rf-flow-center"><span>fb↗</span><small>Felix kümmert sich.</small></div>
          <span className="rf-flow-node rf-flow-node-a">↻<small>Updates</small></span>
          <span className="rf-flow-node rf-flow-node-b">▣<small>Backups</small></span>
          <span className="rf-flow-node rf-flow-node-c">↗<small>Performance</small></span>
          <span className="rf-flow-node rf-flow-node-d">✎<small>Änderungen</small></span>
          <span className="rf-flow-orbit" /><span className="rf-flow-dot" />
        </div>
        <div className="rf-flow-caption"><span className="rf-status" />Hosting · Sicherheit · Pflege · Weiterentwicklung</div>
      </div>
      <p>Sie führen Ihren Betrieb. Ich halte die Website im Blick.</p>
    </figure>
  )
}
