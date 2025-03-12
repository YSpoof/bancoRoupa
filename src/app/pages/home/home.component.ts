import { Component } from '@angular/core';
import { AccountCardComponent } from '../../components/home/account-card/account-card.component';
import { CardComponent } from '../../components/home/card/card.component';
import { FooterComponent } from '../../components/home/footer/footer.component';
import { HeaderComponent } from '../../components/home/header/header.component';
import { IntroModalComponent } from '../../components/home/intro-modal/intro-modal.component';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    FooterComponent,
    IntroModalComponent,
    CardComponent,
    AccountCardComponent,
  ],
  template: ` <app-header />
    <div
      id="sectionBanner"
      class="bg-[url('https://picsum.photos/1280/720')] bg-cover bg-bottom"
    >
      <section
        id="introSection"
        class="container mx-auto h-screen grid place-items-center text-white"
      >
        <div class="w-full flex flex-col gap-4 md:flex-row justify-between">
          <h1
            class="font-bold text-lg md:text-4xl bg-vb-black/80 backdrop-blur-sm self-center p-4"
          >
            VestBank, o banco que não te deixa pelado!
          </h1>
          <app-intro-modal />
        </div>
      </section>
    </div>
    <section id="cardsSection" class="py-16 bg-stone-200">
      <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <app-card title="Diminuição de impostos">
          Diminuição de impostos para os mais ricos e principalmente para os
          mais pobres.
        </app-card>
        <app-card title="Mais investimentos">
          Investimentos em educação, saúde e segurança são as nossas
          prioridades.
        </app-card>
        <app-card title="Combate à corrupção">
          Aumento no combate à corrupção e fiscalização efetiva.
        </app-card>
      </div>
    </section>
    <section id="creditCardSection" class="py-32 bg-stone-100">
      <div
        class="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between"
      >
        <div class="p-4">
          <h2 class="text-4xl md:text-6xl text-vbdarkgreen font-bold">
            Cartão de crédito
          </h2>
          <p class="text-lg md:text-2xl text-vbmediumgreen mt-4">
            Feito com muito carinho. Por conta disso ele não é moderno custa
            caro e não tem vantagens.
          </p>
        </div>
        <div class="grow-2 w-full">
          <img
            src="https://picsum.photos/640/480"
            alt="Descrição da imagem"
            class="mx-auto"
            width="640"
            height="480"
          />
        </div>
      </div>
    </section>
    <section id="experienceSection" class="py-32 bg-stone-200">
      <div
        class="container mx-auto flex flex-col md:flex-row items-center justify-between"
      >
        <div class="grow-2 w-full">
          <img
            src="https://picsum.photos/640/480"
            alt="Descrição da imagem"
            class="mx-auto"
            width="640"
            height="480"
          />
        </div>
        <div class="p-4">
          <h2 class="text-4xl md:text-6xl text-vbdarkgreen font-bold">
            Combo de vantagens
          </h2>
          <p class="text-lg md:text-2xl text-vbmediumgreen mt-4">
            Cliente VB quando usa o cartão de crédito, ganha pontos que podem
            ser trocados por descontos em produtos e serviços.
          </p>
        </div>
      </div>
    </section>
    <section id="accountsSection" class="py-32 bg-stone-100">
      <div
        class="container mx-auto flex flex-col md:flex-row gap-4 justify-between"
      >
        <app-account-card title="Conta PF">
          Conta para pessoa física. Com ela você pode fazer transferências,
          pagamentos e muito mais.
        </app-account-card>
        <app-account-card title="Conta PJ">
          Conta para pessoa jurídica. Com ela você pode fazer transferências,
          pagamentos e muito mais.
        </app-account-card>
      </div>
    </section>
    <app-footer />`,
})
export class HomePageComponent {}
