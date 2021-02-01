<template>
  <section class="legal">
    <div class="legal__wrapper">
      <h1 class="legal__headline">{{ $t('legal.headline') }}</h1>
      <div class="legal__content">
        <p>Angaben gemäß § 5 TMG</p>
        <p>
          Justin Hiller <br />
          Däumlingweg 12<br />
          70567 Stuttgart <br />
        </p>
        <p>
          <strong>Kontakt:</strong> <br />
          Telefon: +49 1573 040 3495<br />
          E-Mail:
          <a href="mailto:justin@hiller-family.com">justin@hiller-family.com</a
          ><br />
        </p>
        <br />
        <p>
          <strong>Haftungsausschluss: </strong><br /><br /><strong
            >Haftung für Inhalte</strong
          ><br /><br />
          Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für
          die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir
          jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7
          Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen
          Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
          Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
          gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
          forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
          Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
          Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
          Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
          von entsprechenden Rechtsverletzungen werden wir diese Inhalte
          umgehend entfernen.<br /><br /><strong>Haftung für Links</strong
          ><br /><br />
          Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren
          Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
          fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
          verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
          Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
          Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige
          Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine
          permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne
          konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
          Bekanntwerden von Rechtsverletzungen werden wir derartige Links
          umgehend entfernen.<br /><br /><strong>Datenschutz</strong
          ><br /><br />
          Die Nutzung unserer Webseite ist in der Regel ohne Angabe
          personenbezogener Daten möglich. Soweit auf unseren Seiten
          personenbezogene Daten (beispielsweise Name, Anschrift oder
          eMail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets
          auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche
          Zustimmung nicht an Dritte weitergegeben. <br />
          Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei
          der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein
          lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht
          möglich. <br />
          Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten
          Kontaktdaten durch Dritte zur Übersendung von nicht ausdrücklich
          angeforderter Werbung und Informationsmaterialien wird hiermit
          ausdrücklich widersprochen. Die Betreiber der Seiten behalten sich
          ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung
          von Werbeinformationen, etwa durch Spam-Mails, vor.<br />
          <br /><br /><strong>Google Analytics</strong><br /><br />
          Diese Website benutzt Google Analytics, einen Webanalysedienst der
          Google Inc. (''Google''). Google Analytics verwendet sog. ''Cookies'',
          Textdateien, die auf Ihrem Computer gespeichert werden und die eine
          Analyse der Benutzung der Website durch Sie ermöglicht. Die durch den
          Cookie erzeugten Informationen über Ihre Benutzung dieser Website
          (einschließlich Ihrer IP-Adresse) wird an einen Server von Google in
          den USA übertragen und dort gespeichert. Google wird diese
          Informationen benutzen, um Ihre Nutzung der Website auszuwerten, um
          Reports über die Websiteaktivitäten für die Websitebetreiber
          zusammenzustellen und um weitere mit der Websitenutzung und der
          Internetnutzung verbundene Dienstleistungen zu erbringen. Auch wird
          Google diese Informationen gegebenenfalls an Dritte übertragen, sofern
          dies gesetzlich vorgeschrieben oder soweit Dritte diese Daten im
          Auftrag von Google verarbeiten. Google wird in keinem Fall Ihre
          IP-Adresse mit anderen Daten der Google in Verbindung bringen. Sie
          können die Installation der Cookies durch eine entsprechende
          Einstellung Ihrer Browser Software verhindern; wir weisen Sie jedoch
          darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche
          Funktionen dieser Website voll umfänglich nutzen können. Durch die
          Nutzung dieser Website erklären Sie sich mit der Bearbeitung der über
          Sie erhobenen Daten durch Google in der zuvor beschriebenen Art und
          Weise und zu dem zuvor benannten Zweck einverstanden.
        </p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class Legal extends Vue {}
</script>

<style lang="scss">
.legal {
  @include grid(12, true);

  &__wrapper {
    @include grid-column(12, 1);

    display: flex;
    flex-direction: column;
    align-items: center;

    @include viewport_mq5 {
      @include grid-column(6, 4);
    }
  }

  &__headline {
    @include typo_hl3($color--shark);
    @include spacing('margin-bottom', md);

    @include viewport_mq3 {
      @include typo_hl2($color--shark);
      @include spacing('margin-bottom', lg);
    }

    @include viewport_mq6 {
      @include typo_hl1($color--shark);
    }
  }

  &__content {
    @include spacing('padding', xs);
    @include typo_text;

    background-color: $color--white;
    border-radius: 8px;

    @include viewport_mq3 {
      @include spacing('padding', md);
    }
  }
}
</style>
