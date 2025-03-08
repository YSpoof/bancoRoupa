import { Component } from '@angular/core';
import { FooterComponent } from '../../components/home/footer/footer.component';
import { HeaderComponent } from '../../components/home/header/header.component';
import { IntroModalComponent } from '../../components/home/intro-modal/intro-modal.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FooterComponent, IntroModalComponent],
  template: ` <app-header />
    <div class="bg-bcrdarkgreen">
      <div
        id="sectionBanner"
        class="bg-[url('https://picsum.photos/1280/720')] bg-cover bg-bottom"
      >
        <section
          id="intro"
          class="container mx-auto h-screen grid place-items-center text-white"
        >
          <div class="w-full flex justify-between">
            <h1
              class="font-bold text-4xl bg-bcrblack/80 backdrop-blur-sm self-center p-4"
            >
              Vestido Bank. Temos as menores taxas.
            </h1>
            <app-intro-modal />
          </div>
        </section>
      </div>
    </div>
    <app-footer />`,
})
export class HomePageComponent {}
