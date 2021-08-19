import { defineComponent, PropType, toRef } from '@vue/composition-api';
import { StratTypes } from '@/api/models/StratTypes';

import imgRifle from 'src/assets/icons/rifle.png';
import imgMp5 from 'src/assets/icons/mp5.png';
import imgPistol from 'src/assets/icons/pistol.png';

import './TypeBadge.scss';

export default defineComponent({
  name: 'type-badge',

  props: {
    type: {
      type: String as PropType<StratTypes>,
      required: true,
    },
  },

  setup(props) {
    const strategyType = toRef(props.type);

    return {
      strategyType,
    };
  },

  render() {
    const getWeaponImage = (type: StratTypes) => {
      switch (type) {
        case Types.BUYROUND:
          return imgRifle;
        case Types.FORCE:
          return imgMp5;
        default:
          return imgPistol;
      }
    };

    return (
      <div
        class={[
          'type-badge',
          {
            '--buyround': this.strategyType === Types.BUYROUND,
            '--force': this.strategyType === Types.FORCE,
            '--pistol': this.strategyType === Types.PISTOL,
          },
        ]}>
        <img
          class={[
            'type-badge__icon',
            {
              '--buyround': this.strategyType === Types.BUYROUND,
              '--force': this.strategyType === Types.FORCE,
              '--pistol': this.strategyType === Types.PISTOL,
            },
          ]}
          src={getWeaponImage(this.strategyType)}
        />
      </div>
    );
  },
});
