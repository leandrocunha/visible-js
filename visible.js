function screentime(options) {
  const config = { ...options };
  // let started = false;
  let visibles = {};
  let reporter;

  const self = {
    init: () => {
      config.fields.map(({ selector, name }) => {
        const element = document.querySelector(selector);

        // check if element exists on Page
        if (element) {
          const isVisible = self.onScreen(
            self.viewport(),
            self.field(element, name)
          );

          if (isVisible) {
            visibles[name] = 0;
          }
        }
      });

      self.startTimer();

      visibly.onHidden(() => self.stopTimer());

      visibly.onVisible(() => {
        self.stopTimer();
        self.startTimer();
      });
    },

    onScreen: (viewport, field) => {
      if (field.top < 0 && field.bottom > 0 && field.bottom < viewport.height) {
        return true;
      }

      if (field.top > 0 && field.top < viewport.height) {
        return true;
      }

      if (
        field.top < 0 &&
        field.top < viewport.height &&
        field.bottom > 0 &&
        field.bottom > viewport.height
      ) {
        return true;
      }
    },

    viewport: () => {
      const top = window.scrollY;
      const height =
        window.innerHeight || document.documentElement.clientHeight;
      const bottom = top + height;
      const width = window.innerWidth || document.documentElement.clientWidth;

      return { top, height, bottom, width };
    },

    field: (element, name) => {
      const offSet = element.getBoundingClientRect();
      const top = offSet.top + document.body.scrollTop;
      const height = offSet.height;
      const bottom = top + height;
      const width = offSet.width;

      return { name, top, height, bottom, width };
    },

    startTimer: () => {
      // if (!started) {
      //   self.checkViewport();
      //   started = true;
      // }

      looker = setInterval(function () {
        self.checkViewport();
      }, 1000);

      reporter = setInterval(function () {
        self.report();
      }, config.reportInterval * 1000);
    },

    stopTimer: () => {
      clearInterval(looker);
      clearInterval(reporter);
    },

    checkViewport: () => {
      config.fields.map(({ selector, name }) => {
        const element = document.querySelector(selector);

        // check if element exists on Page
        if (element) {
          const isVisible = self.onScreen(
            self.viewport(),
            self.field(element, name)
          );

          if (isVisible) {
            if (visibles.hasOwnProperty(name)) {
              visibles[name] += 1;
            } else {
              visibles[name] = 0;
            }
          }
        }
      });
    },

    report: () => {
      config.callback.call(this, visibles);
    },
  };

  self.init();

  return self;
}
