<template>
  <a-card @click="onClickCard" hoverable class="book-card">
    <template v-if="type == 'default' && data">
      <div class="book-card__icon">
        <i :class="`fad fa-${data.iconName}`"></i>
      </div>
      <div class="book-card__name">{{ data.name }}</div>
      <hr />
      <div v-if="profile.role !== 'ADMIN'">--</div>
      <div
        v-else
        :class="[
          'm-t-15',
          'book-card__balance',
          `book-card__balance--${data.currentBalance > 0 ? 'plus' : 'minus'}`,
        ]"
      >
        {{ `${data.currentBalance > 0 ? "+" : "-"}`
        }}{{ data.currentBalance | money({ currency: "vnd" }) }}
      </div>
    </template>
    <template v-if="type == 'blank'">
      <div class="book-card__blank">
        <i :class="`fad fa-${icon}`"></i>
        <span>{{ name }}</span>
      </div>
    </template>
  </a-card>
</template>

<script>
import { mapGetters } from "vuex";
import { types as typesAuth } from "@/modules/auth/constant";
export default {
  name: "BookCard",
  props: {
    data: {
      default: null,
    },
    type: {
      default: "default",
    },
    icon: {
      default: "plus",
    },
    name: {
      default: "Thêm sổ",
    },
  },
  methods: {
    onClickCard() {
      this.$emit("click", this.data);
    },
  },
  computed: {
    ...mapGetters({
      profile: typesAuth.getters.GET_USER_PROFILE,
    }),
  },
};
</script>

<style lang="scss">
.book-card {
  width: 250px;
  height: 250px;
  border-radius: 8px;
  text-align: center;
  font-size: 16px;
  &__blank {
    display: flex;
    flex-direction: column;
    text-align: center;
    i {
      margin-top: 50px;
      font-size: 60px;
    }
    span {
      margin-top: 30px;
      font-weight: 600;
    }
  }
  &__icon {
    height: 110px;
    i {
      font-size: 40px;
      transform: translateY(20px);
    }
  }
  &__name {
    height: 35px;
    font-weight: 600;
  }
  &__balance {
    &--minus {
      color: $danger-color;
    }
    &--plus {
      color: $success-color;
    }
    height: 60px;
  }
}
</style>